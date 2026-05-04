export interface ExifData {
  camera?: string
  lens?: string
  aperture?: string
  shutterSpeed?: string
  iso?: number
  focalLength?: string
  location?: string
  takenAt?: string
}

export interface Photo {
  _id: string
  title: string
  description?: string
  imageUrl: string
  thumbnailUrl: string
  author: {
    _id: string
    username: string
    displayName: string
    avatar?: string
  }
  album?: string
  tags: string[]
  exif?: ExifData
  likesCount: number
  commentsCount: number
  viewsCount: number
  isLiked: boolean
  createdAt: string
}

export interface Album {
  _id: string
  title: string
  description?: string
  coverImage?: string
  photosCount: number
  author: string
  createdAt: string
}
