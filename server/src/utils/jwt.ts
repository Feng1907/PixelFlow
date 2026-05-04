import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import type { AuthPayload } from '../types'

export function signAccessToken(payload: Omit<AuthPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions)
}

export function signRefreshToken(payload: Omit<AuthPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions)
}

export function verifyAccessToken(token: string): AuthPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthPayload
}

export function verifyRefreshToken(token: string): AuthPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as AuthPayload
}
