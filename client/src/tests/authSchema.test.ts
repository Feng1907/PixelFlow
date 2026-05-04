import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from '@/features/auth/types'

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'secret' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'secret' })
    expect(result.success).toBe(false)
  })

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '' })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  const valid = {
    displayName: 'An Phong',
    username: 'anphong',
    email: 'anphong@example.com',
    password: 'Password1',
    confirmPassword: 'Password1',
  }

  it('accepts valid registration data', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: 'Different1' })
    expect(result.success).toBe(false)
  })

  it('rejects weak password (no uppercase)', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'password1', confirmPassword: 'password1' })
    expect(result.success).toBe(false)
  })

  it('rejects username with special characters', () => {
    const result = registerSchema.safeParse({ ...valid, username: 'user name!' })
    expect(result.success).toBe(false)
  })

  it('rejects username shorter than 3 chars', () => {
    const result = registerSchema.safeParse({ ...valid, username: 'ab' })
    expect(result.success).toBe(false)
  })
})
