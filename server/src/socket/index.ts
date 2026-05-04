import type { Server } from 'http'
import { Server as SocketServer, type Socket } from 'socket.io'
import { verifyAccessToken } from '../utils/jwt'
import Photo from '../models/Photo'
import Comment from '../models/Comment'
import { env } from '../config/env'
import type { AuthPayload } from '../types'

export function initSocket(httpServer: Server): SocketServer {
  const io = new SocketServer(httpServer, {
    cors: { origin: env.CLIENT_URL, credentials: true },
  })

  // Auth middleware
  io.use((socket: Socket, next: (err?: Error) => void) => {
    try {
      const token =
        (socket.handshake.auth as Record<string, string>)['token'] ??
        (socket.handshake.headers['cookie'] ?? '')
          .split(';')
          .find((c: string) => c.trim().startsWith('accessToken='))
          ?.split('=')[1]

      if (token) {
        socket.data = { user: verifyAccessToken(token) } as { user: AuthPayload }
      }
      next()
    } catch {
      next() // allow unauthenticated connections for read-only
    }
  })

  io.on('connection', (socket: Socket) => {
    const user = (socket.data as { user?: AuthPayload }).user

    // Join photo rooms for real-time updates
    socket.on('photo:join', (photoId: string) => {
      void socket.join(`photo:${photoId}`)
    })

    socket.on('photo:leave', (photoId: string) => {
      void socket.leave(`photo:${photoId}`)
    })

    // Real-time like
    socket.on('photo:like', async ({ photoId }: { photoId: string }) => {
      if (!user) return

      const photo = await Photo.findById(photoId)
      if (!photo) return

      const alreadyLiked = photo.likedBy.some((id) => id.toString() === user.userId)

      if (alreadyLiked) {
        photo.likedBy = photo.likedBy.filter((id) => id.toString() !== user.userId)
        photo.likesCount = Math.max(0, photo.likesCount - 1)
      } else {
        photo.likedBy.push(new (require('mongoose').Types.ObjectId)(user.userId))
        photo.likesCount += 1
      }

      await photo.save()

      // Broadcast to everyone in the photo room
      io.to(`photo:${photoId}`).emit('photo:liked', {
        photoId,
        likesCount: photo.likesCount,
        userId: user.userId,
        liked: !alreadyLiked,
      })
    })

    // Real-time comment
    socket.on('photo:comment', async ({ photoId, text }: { photoId: string; text: string }) => {
      if (!user || !text?.trim()) return

      const comment = await Comment.create({
        photo: photoId,
        author: user.userId,
        text: text.trim().slice(0, 500),
      })

      await comment.populate('author', 'username displayName avatar')
      await Photo.findByIdAndUpdate(photoId, { $inc: { commentsCount: 1 } })

      io.to(`photo:${photoId}`).emit('photo:commented', { photoId, comment })
    })

    socket.on('disconnect', () => { /* cleanup handled by socket.io */ })
  })

  return io
}
