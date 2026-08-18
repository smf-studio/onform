import { type Contact } from 'features/contacts/schema'

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts.at(0)?.charAt(0) ?? ''
  const last = parts.length > 1 ? (parts.at(-1)?.charAt(0) ?? '') : ''
  return (first + last).toUpperCase()
}

export function filterContacts(
  contacts: readonly Contact[],
  query: string,
): Contact[] {
  const needle = query.trim().toLowerCase()
  if (needle === '') {
    return [...contacts]
  }
  return contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(needle) ||
      contact.email.toLowerCase().includes(needle),
  )
}
