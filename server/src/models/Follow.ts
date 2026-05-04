import mongoose, { type Document, type Model } from 'mongoose'

export interface IFollow extends Document {
  follower: mongoose.Types.ObjectId
  following: mongoose.Types.ObjectId
  createdAt: Date
}

const followSchema = new mongoose.Schema<IFollow>(
  {
    follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

followSchema.index({ follower: 1, following: 1 }, { unique: true })
followSchema.index({ following: 1 })

const Follow: Model<IFollow> = mongoose.model<IFollow>('Follow', followSchema)
export default Follow
