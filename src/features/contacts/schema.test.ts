import { describe, expect, it } from 'vitest'

import { contactInputSchema } from 'features/contacts/schema'

const validInput = {
  email: 'ada@example.com',
  name: 'Ada Lovelace',
  notes: '',
}

describe('contactInputSchema', () => {
  it('accepts valid input', () => {
    expect(contactInputSchema.parse(validInput)).toEqual(validInput)
  })

  it('trims whitespace from name and notes', () => {
    const parsed = contactInputSchema.parse({
      ...validInput,
      name: '  Ada Lovelace  ',
      notes: '  hello  ',
    })
    expect(parsed.name).toBe('Ada Lovelace')
    expect(parsed.notes).toBe('hello')
  })

  it('rejects an invalid email', () => {
    const result = contactInputSchema.safeParse({
      ...validInput,
      email: 'not-an-email',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a name shorter than 2 characters', () => {
    const result = contactInputSchema.safeParse({ ...validInput, name: 'A' })
    expect(result.success).toBe(false)
  })

  it('rejects notes longer than 500 characters', () => {
    const result = contactInputSchema.safeParse({
      ...validInput,
      notes: 'x'.repeat(501),
    })
    expect(result.success).toBe(false)
  })
})
