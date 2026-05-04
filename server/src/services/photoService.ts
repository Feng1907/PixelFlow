import Photo from '../models/Photo'
import User from '../models/User'
import { cloudinary } from '../config/cloudinary'
import { AppError } from '../middlewares/errorHandler'
import type { IExif } from '../models/Photo'

interface UploadPhotoDto {
  title: string
  description?: string
  tags?: string
  album?: string
  exif?: IExif
  authorId: string
  fileBuffer: Buffer
  mimetype: string
}

interface GetPhotosQuery {
  page: number
  limit: number
  sort: 'latest' | 'popular' | 'trending'
  tag?: string
  authorId?: string
  search?: string
}

export const photoService = {
  async upload(dto: UploadPhotoDto) {
    // Upload original to Cloudinary
    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'pixelflow/photos',
            resource_type: 'image',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          },
          (err, result) => {
            if (err || !result) return reject(err ?? new Error('Upload failed'))
            resolve(result as { secure_url: string; public_id: string })
          }
        )
        stream.end(dto.fileBuffer)
      }
    )

    // Generate thumbnail URL via Cloudinary transforms
    const thumbnailUrl = cloudinary.url(uploadResult.public_id, {
      width: 400,
      height: 400,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    })

    const tags = dto.tags
      ? dto.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
      : []

    const photo = await Photo.create({
      title: dto.title,
      description: dto.description,
      imageUrl: uploadResult.secure_url,
      thumbnailUrl,
      cloudinaryPublicId: uploadResult.public_id,
      author: dto.authorId,
      album: dto.album || undefined,
      tags,
      exif: dto.exif,
    })

    // Increment user photo count
    await User.findByIdAndUpdate(dto.authorId, { $inc: { photosCount: 1 } })

    return photo.populate('author', 'username displayName avatar')
  },

  async getMany(query: GetPhotosQuery) {
    const { page, limit, sort, tag, authorId, search } = query
    const filter: Record<string, unknown> = {}

    if (tag) filter.tags = tag
    if (authorId) filter.author = authorId
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { 'exif.camera': { $regex: search, $options: 'i' } },
        { 'exif.location': { $regex: search, $options: 'i' } },
      ]
    }

    const sortMap = {
      latest: { createdAt: -1 as const },
      popular: { likesCount: -1 as const },
      trending: { viewsCount: -1 as const },
    }

    const [photos, total] = await Promise.all([
      Photo.find(filter)
        .sort(sortMap[sort])
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('author', 'username displayName avatar'),
      Photo.countDocuments(filter),
    ])

    return { photos, total, hasMore: page * limit < total }
  },

  async getById(photoId: string, userId?: string) {
    const photo = await Photo.findByIdAndUpdate(
      photoId,
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).populate('author', 'username displayName avatar')

    if (!photo) throw new AppError('Photo not found', 404)

    return {
      ...photo.toJSON(),
      isLiked: userId ? photo.likedBy.some((id) => id.toString() === userId) : false,
    }
  },

  async toggleLike(photoId: string, userId: string) {
    const photo = await Photo.findById(photoId)
    if (!photo) throw new AppError('Photo not found', 404)

    const alreadyLiked = photo.likedBy.some((id) => id.toString() === userId)

    if (alreadyLiked) {
      photo.likedBy = photo.likedBy.filter((id) => id.toString() !== userId)
      photo.likesCount = Math.max(0, photo.likesCount - 1)
    } else {
      photo.likedBy.push(new (require('mongoose').Types.ObjectId)(userId))
      photo.likesCount += 1
    }

    await photo.save()
    return { liked: !alreadyLiked, likesCount: photo.likesCount }
  },

  async delete(photoId: string, userId: string) {
    const photo = await Photo.findById(photoId)
    if (!photo) throw new AppError('Photo not found', 404)
    if (photo.author.toString() !== userId) throw new AppError('Forbidden', 403)

    await cloudinary.uploader.destroy(photo.cloudinaryPublicId)
    await photo.deleteOne()
    await User.findByIdAndUpdate(userId, { $inc: { photosCount: -1 } })
  },
}
