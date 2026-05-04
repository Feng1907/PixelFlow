import type { Response } from 'express'
import type { ApiResponse } from '../types'

export function ok<T>(res: Response, data: T, message?: string): Response {
  const body: ApiResponse<T> = { success: true, data }
  if (message) body.message = message
  return res.status(200).json(body)
}

export function created<T>(res: Response, data: T, message?: string): Response {
  const body: ApiResponse<T> = { success: true, data }
  if (message) body.message = message
  return res.status(201).json(body)
}

export function noContent(res: Response): Response {
  return res.status(204).send()
}
