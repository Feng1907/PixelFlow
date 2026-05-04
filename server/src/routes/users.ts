import { Router } from 'express'
import { z } from 'zod'
import User from '../models/User'
import { followService } from '../services/followService'
import { authenticate, optionalAuth } from '../middlewares/authenticate'
import { validate } from '../middlewares/validate'
import { ok } from '../utils/response'
import { AppError } from '../middlewares/errorHandler'
import type { AuthRequest } from '../types'
import type { NextFunction, Response } from 'express'
import multer from 'multer'
import { cloudinary } from '../config/cloudinary'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

const updateSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  bio: z.string().max(300).optional(),
  website: z.string().url().or(z.literal('')).optional(),
})

// GET /users/:username
router.get('/:username', optionalAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ username: req.params['username'] as string })
    if (!user) throw new AppError('User not found', 404)

    const isFollowing = req.user
      ? await followService.isFollowing(req.user.userId, user._id.toString())
      : false

    ok(res, { user, isFollowing })
  } catch (err) { next(err) }
})

// PATCH /users/me
router.patch('/me', authenticate, validate(updateSchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401)
    const user = await User.findByIdAndUpdate(req.user.userId, req.body as object, { new: true })
    ok(res, { user })
  } catch (err) { next(err) }
})

// POST /users/me/avatar
router.post('/me/avatar', authenticate, upload.single('avatar'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401)
    if (!req.file) throw new AppError('No file', 400)

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'pixelflow/avatars', transformation: [{ width: 200, height: 200, crop: 'fill' }] },
        (err, res) => { if (err || !res) return reject(err); resolve(res as { secure_url: string }) }
      )
      stream.end(req.file!.buffer)
    })

    const user = await User.findByIdAndUpdate(req.user.userId, { avatar: result.secure_url }, { new: true })
    ok(res, { user })
  } catch (err) { next(err) }
})

// POST /users/:username/follow
router.post('/:username/follow', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401)
    const result = await followService.toggle(req.user.userId, req.params['username'] as string)
    ok(res, result)
  } catch (err) { next(err) }
})

// GET /users/:username/followers
router.get('/:username/followers', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ username: req.params['username'] as string })
    if (!user) throw new AppError('User not found', 404)
    const followers = await followService.getFollowers(user._id.toString())
    ok(res, { followers })
  } catch (err) { next(err) }
})

export default router
