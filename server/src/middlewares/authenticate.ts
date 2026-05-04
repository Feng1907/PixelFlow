import type { Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { AppError } from './errorHandler'
import type { AuthRequest } from '../types'

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction): void {
  try {
    // Support Bearer token or HttpOnly cookie
    const authHeader = req.headers.authorization
    const token =
      (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null) ??
      (req.cookies as Record<string, string | undefined>)['accessToken']

    if (!token) throw new AppError('Authentication required', 401)

    req.user = verifyAccessToken(token)
    next()
  } catch (err) {
    next(err)
  }
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization
    const token =
      (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null) ??
      (req.cookies as Record<string, string | undefined>)['accessToken']

    if (token) req.user = verifyAccessToken(token)
  } catch {
    // ignore — optional auth
  }
  next()
}
