import { describe, expect, it } from 'vitest'

import { type Contact } from 'features/contacts/schema'
import { filterContacts, getInitials } from 'features/contacts/utils'

const contacts: Contact[] = [
  { email: 'ada@example.com', id: '1', name: 'Ada Lovelace', notes: '' },
  { email: 'grace@example.com', id: '2', name: 'Grace Hopper', notes: '' },
]

describe('getInitials', () => {
  it('takes the first letter of the first and last name', () => {
    expect(getInitials('Ada Lovelace')).toBe('AL')
  })

  it('uses a single letter for single names', () => {
    expect(getInitials('Ada')).toBe('A')
  })

  it('ignores middle names', () => {
    expect(getInitials('Augusta Ada King')).toBe('AK')
  })

  it('handles surrounding and repeated whitespace', () => {
    expect(getInitials('  ada   lovelace  ')).toBe('AL')
  })

  it('returns an empty string for empty input', () => {
    expect(getInitials('')).toBe('')
  })
})

describe('filterContacts', () => {
  it('returns all contacts for an empty query', () => {
    expect(filterContacts(contacts, '')).toHaveLength(2)
  })

  it('matches on name, case-insensitively', () => {
    expect(filterContacts(contacts, 'ADA')).toEqual([contacts[0]])
  })

  it('matches on email', () => {
    expect(filterContacts(contacts, 'grace@')).toEqual([contacts[1]])
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterContacts(contacts, 'zzz')).toEqual([])
  })

  it('does not mutate its input', () => {
    const before = [...contacts]
    filterContacts(contacts, 'ada')
    expect(contacts).toEqual(before)
  })
})
