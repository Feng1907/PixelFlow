import mongoose, { type Document, type Model } from 'mongoose'

export interface IExif {
  camera?: string
  lens?: string
  aperture?: string
  shutterSpeed?: string
  iso?: number
  focalLength?: string
  location?: string
  takenAt?: string
}

export interface IPhoto extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  description?: string
  imageUrl: string
  thumbnailUrl: string
  cloudinaryPublicId: string
  author: mongoose.Types.ObjectId
  album?: mongoose.Types.ObjectId
  tags: string[]
  exif?: IExif
  likesCount: number
  commentsCount: number
  viewsCount: number
  likedBy: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const exifSchema = new mongoose.Schema<IExif>(
  {
    camera: String,
    lens: String,
    aperture: String,
    shutterSpeed: String,
    iso: Number,
    focalLength: String,
    location: String,
    takenAt: String,
  },
  { _id: false }
)

const photoSchema = new mongoose.Schema<IPhoto>(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
    tags: [{ type: String, lowercase: true, trim: true }],
    exif: exifSchema,
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
)

photoSchema.index({ tags: 1 })
photoSchema.index({ createdAt: -1 })
photoSchema.index({ likesCount: -1 })

const Photo: Model<IPhoto> = mongoose.model<IPhoto>('Photo', photoSchema)
export default Photo
