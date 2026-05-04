import mongoose, { type Document, type Model } from 'mongoose'

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId
  photo: mongoose.Types.ObjectId
  author: mongoose.Types.ObjectId
  text: string
  createdAt: Date
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    photo: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
)

const Comment: Model<IComment> = mongoose.model<IComment>('Comment', commentSchema)
export default Comment
