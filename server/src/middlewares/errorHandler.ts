import type { Request, Response, NextFunction } from 'express'

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors?: Record<string, string>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    })
    return
  }

  // Mongoose duplicate key
  if ('code' in err && (err as NodeJS.ErrnoException).code === '11000') {
    const field = Object.keys((err as unknown as { keyValue: object }).keyValue ?? {})[0]
    res.status(409).json({
      success: false,
      message: `${field ? `${field} already` : 'Value already'} exists`,
    })
    return
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    res.status(400).json({ success: false, message: err.message })
    return
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, message: 'Invalid or expired token' })
    return
  }

  console.error('[Error]', err)
  res.status(500).json({ success: false, message: 'Internal server error' })
}
