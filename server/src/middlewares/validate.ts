import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AppError } from './errorHandler'

export function validate<T>(schema: z.ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const key = issue.path.map(String).join('.')
        errors[key] = issue.message
      })
      return next(new AppError('Validation failed', 400, errors))
    }
    req.body = result.data
    next()
  }
}
