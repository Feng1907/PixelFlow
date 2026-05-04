import { describe, it, expect } from 'vitest'
import { nanoid } from '@/utils/nanoid'

describe('nanoid', () => {
  it('returns a non-empty string', () => {
    expect(typeof nanoid()).toBe('string')
    expect(nanoid().length).toBeGreaterThan(0)
  })

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 1000 }, () => nanoid()))
    expect(ids.size).toBe(1000)
  })
})
