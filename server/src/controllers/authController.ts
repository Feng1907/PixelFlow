import type { Request, Response, NextFunction } from 'express'
import { authService } from '../services/authService'
import User from '../models/User'
import { AppError } from '../middlewares/errorHandler'
import { ok, created } from '../utils/response'
import { env } from '../config/env'
import type { AuthRequest } from '../types'

const COOKIE_OPTS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
}

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, accessToken, refreshToken } = await authService.register(req.body as {
        username: string; email: string; password: string; displayName: string
      })
      res.cookie('accessToken', accessToken, COOKIE_OPTS)
      res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTS, maxAge: 30 * 24 * 60 * 60 * 1000 })
      created(res, { user, accessToken }, 'Account created successfully')
    } catch (err) {
      next(err)
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, accessToken, refreshToken } = await authService.login(req.body as {
        email: string; password: string
      })
      res.cookie('accessToken', accessToken, COOKIE_OPTS)
      res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTS, maxAge: 30 * 24 * 60 * 60 * 1000 })
      ok(res, { user, accessToken })
    } catch (err) {
      next(err)
    }
  },

  async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    ok(res, null, 'Logged out successfully')
  },

  async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401)
      const user = await User.findById(req.user.userId)
      if (!user) throw new AppError('User not found', 404)
      ok(res, { user })
    } catch (err) {
      next(err)
    }
  },
}
