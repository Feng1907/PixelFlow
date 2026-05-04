import type { Request } from 'express'
import type { JwtPayload } from 'jsonwebtoken'

export interface AuthPayload extends JwtPayload {
  userId: string
  email: string
}

export interface AuthRequest extends Request {
  user?: AuthPayload
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
}

export interface PaginationQuery {
  page?: string
  limit?: string
}
