import mongoose, { type Document, type Model } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  username: string
  email: string
  password: string
  displayName: string
  avatar?: string
  bio?: string
  website?: string
  followersCount: number
  followingCount: number
  photosCount: number
  createdAt: Date
  updatedAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9_]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false, minlength: 8 },
    displayName: { type: String, required: true, trim: true, maxlength: 50 },
    avatar: { type: String },
    bio: { type: String, maxlength: 300 },
    website: { type: String, maxlength: 100 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    photosCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password as string)
}

// Never expose password in JSON
userSchema.set('toJSON', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc: unknown, ret: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete ret.password
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return ret
  },
})

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema)
export default User
