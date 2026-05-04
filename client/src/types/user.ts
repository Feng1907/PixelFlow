export interface User {
  _id: string
  username: string
  email: string
  displayName: string
  avatar?: string
  bio?: string
  website?: string
  followersCount: number
  followingCount: number
  photosCount: number
  createdAt: string
}
