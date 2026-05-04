import Follow from '../models/Follow'
import User from '../models/User'
import { AppError } from '../middlewares/errorHandler'

export const followService = {
  async toggle(followerId: string, targetUsername: string) {
    const target = await User.findOne({ username: targetUsername })
    if (!target) throw new AppError('User not found', 404)
    if (target._id.toString() === followerId) throw new AppError('Cannot follow yourself', 400)

    const existing = await Follow.findOne({ follower: followerId, following: target._id })

    if (existing) {
      await existing.deleteOne()
      await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } })
      await User.findByIdAndUpdate(target._id, { $inc: { followersCount: -1 } })
      return { following: false, followersCount: Math.max(0, target.followersCount - 1) }
    }

    await Follow.create({ follower: followerId, following: target._id })
    await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } })
    await User.findByIdAndUpdate(target._id, { $inc: { followersCount: 1 } })
    return { following: true, followersCount: target.followersCount + 1 }
  },

  async isFollowing(followerId: string, targetId: string): Promise<boolean> {
    const exists = await Follow.exists({ follower: followerId, following: targetId })
    return !!exists
  },

  async getFollowers(userId: string) {
    return Follow.find({ following: userId }).populate('follower', 'username displayName avatar')
  },

  async getFollowing(userId: string) {
    return Follow.find({ follower: userId }).populate('following', 'username displayName avatar')
  },
}
