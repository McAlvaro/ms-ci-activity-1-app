import { describe, expect, it } from 'vitest'
import { contactInputSchema, contactSchema } from './contact'

const valid = { name: 'Ada', email: 'ada@x.com', phone: '+34 600 123 456' }

describe('contactInputSchema', () => {
  it('accepts valid input', () => {
    expect(contactInputSchema.safeParse(valid).success).toBe(true)
  })
  it('accepts an empty phone', () => {
    expect(contactInputSchema.safeParse({ ...valid, phone: '' }).success).toBe(true)
  })
  it('trims the name', () => {
    expect(contactInputSchema.parse({ ...valid, name: '  Ada  ' }).name).toBe('Ada')
  })
  it('rejects empty or whitespace name', () => {
    expect(contactInputSchema.safeParse({ ...valid, name: '   ' }).success).toBe(false)
  })
  it('rejects name longer than 80 chars', () => {
    expect(contactInputSchema.safeParse({ ...valid, name: 'a'.repeat(81) }).success).toBe(false)
  })
  it('rejects invalid email', () => {
    expect(contactInputSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false)
  })
  it('rejects bad phone', () => {
    expect(contactInputSchema.safeParse({ ...valid, phone: 'abc' }).success).toBe(false)
    expect(contactInputSchema.safeParse({ ...valid, phone: '12' }).success).toBe(false)
  })
})

describe('contactSchema', () => {
  it('requires id and createdAt', () => {
    expect(contactSchema.safeParse(valid).success).toBe(false)
    expect(
      contactSchema.safeParse({ ...valid, id: '1', createdAt: '2024-01-01T00:00:00.000Z' }).success,
    ).toBe(true)
  })
})
