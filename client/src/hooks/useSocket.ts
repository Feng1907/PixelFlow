import { useEffect, useCallback } from 'react'
import { getSocket, connectSocket, disconnectSocket } from '@/services/socket'
import { useAppSelector } from '@/store'

export interface LikeEvent {
  photoId: string
  likesCount: number
  userId: string
}

export interface NotificationEvent {
  type: 'like' | 'comment' | 'follow'
  message: string
  fromUser: { username: string; avatar?: string }
  photoId?: string
}

export function useSocket() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      connectSocket()
    } else {
      disconnectSocket()
    }
    return () => { disconnectSocket() }
  }, [isAuthenticated])

  const onLike = useCallback((handler: (e: LikeEvent) => void) => {
    const s = getSocket()
    s.on('photo:liked', handler)
    return () => { s.off('photo:liked', handler) }
  }, [])

  const onNotification = useCallback((handler: (e: NotificationEvent) => void) => {
    const s = getSocket()
    s.on('notification', handler)
    return () => { s.off('notification', handler) }
  }, [])

  const emitLike = useCallback((photoId: string) => {
    getSocket().emit('photo:like', { photoId })
  }, [])

  return { onLike, onNotification, emitLike }
}
