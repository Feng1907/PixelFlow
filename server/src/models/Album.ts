import mongoose, { type Document, type Model } from 'mongoose'

export interface IAlbum extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  description?: string
  coverImage?: string
  author: mongoose.Types.ObjectId
  photosCount: number
  createdAt: Date
  updatedAt: Date
}

const albumSchema = new mongoose.Schema<IAlbum>(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, maxlength: 300 },
    coverImage: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    photosCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const Album: Model<IAlbum> = mongoose.model<IAlbum>('Album', albumSchema)
export default Album
