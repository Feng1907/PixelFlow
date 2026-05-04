import { describe, it, expect } from 'vitest'
import { photoMetaSchema } from '@/features/gallery/types'

describe('photoMetaSchema', () => {
  it('accepts valid metadata', () => {
    const result = photoMetaSchema.safeParse({
      title: 'Golden Hour',
      description: 'Shot in Đà Lạt',
      tags: 'landscape, golden, vietnam',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty title', () => {
    const result = photoMetaSchema.safeParse({ title: '' })
    expect(result.success).toBe(false)
  })

  it('rejects title over 100 chars', () => {
    const result = photoMetaSchema.safeParse({ title: 'A'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('accepts minimal valid data (title only)', () => {
    expect(photoMetaSchema.safeParse({ title: 'My Photo' }).success).toBe(true)
  })

  it('rejects description over 500 chars', () => {
    const result = photoMetaSchema.safeParse({ title: 'Test', description: 'X'.repeat(501) })
    expect(result.success).toBe(false)
  })
})
