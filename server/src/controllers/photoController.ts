import type { Response, NextFunction } from 'express'
import { photoService } from '../services/photoService'
import { AppError } from '../middlewares/errorHandler'
import { ok, created, noContent } from '../utils/response'
import type { AuthRequest } from '../types'

export const photoController = {
  async upload(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401)
      if (!req.file) throw new AppError('No file uploaded', 400)

      const exif = req.body.exif
        ? (JSON.parse(req.body.exif as string) as Record<string, unknown>)
        : undefined

      const photo = await photoService.upload({
        title: req.body.title as string,
        description: req.body.description as string | undefined,
        tags: req.body.tags as string | undefined,
        album: req.body.album as string | undefined,
        exif,
        authorId: req.user.userId,
        fileBuffer: req.file.buffer,
        mimetype: req.file.mimetype,
      })

      created(res, { photo }, 'Photo uploaded successfully')
    } catch (err) {
      next(err)
    }
  },

  async getMany(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1)
      const limit = Math.min(50, parseInt(req.query.limit as string) || 12)
      const sort = (['latest', 'popular', 'trending'].includes(req.query.sort as string)
        ? req.query.sort
        : 'latest') as 'latest' | 'popular' | 'trending'

      const result = await photoService.getMany({
        page,
        limit,
        sort,
        tag: typeof req.query.tag === 'string' ? req.query.tag : undefined,
        authorId: typeof req.query.authorId === 'string' ? req.query.authorId : undefined,
        search: typeof req.query.search === 'string' ? req.query.search : undefined,
      })

      ok(res, {
        photos: result.photos,
        pagination: { page, limit, total: result.total, hasMore: result.hasMore },
      })
    } catch (err) {
      next(err)
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const photo = await photoService.getById(req.params['id'] as string, req.user?.userId)
      ok(res, { photo })
    } catch (err) {
      next(err)
    }
  },

  async toggleLike(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401)
      const result = await photoService.toggleLike(req.params['id'] as string, req.user.userId)
      ok(res, result)
    } catch (err) {
      next(err)
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401)
      await photoService.delete(req.params['id'] as string, req.user.userId)
      noContent(res)
    } catch (err) {
      next(err)
    }
  },
}
