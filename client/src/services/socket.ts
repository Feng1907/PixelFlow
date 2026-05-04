import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL ?? 'http://localhost:5000', {
      withCredentials: true,
      autoConnect: false,
    })
  }
  return socket
}

export function connectSocket(token?: string): void {
  const s = getSocket()
  if (token) s.auth = { token }
  if (!s.connected) s.connect()
}

export function disconnectSocket(): void {
  socket?.disconnect()
}
