import { type Contact, type ContactInput } from 'features/contacts/schema'

/* Stand-in for a real HTTP client. In a real project, replace the module
   bodies with fetch calls to your API and keep the signatures — the
   query layer in queries.ts does not care where the data comes from. */

const LATENCY_MS = 200

const seedContacts: Contact[] = [
  {
    email: 'ada@example.com',
    id: 'seed-1',
    name: 'Ada Lovelace',
    notes: 'Wrote the first algorithm.',
  },
  {
    email: 'grace@example.com',
    id: 'seed-2',
    name: 'Grace Hopper',
    notes: 'Invented the compiler.',
  },
  {
    email: 'alan@example.com',
    id: 'seed-3',
    name: 'Alan Turing',
    notes: '',
  },
]

let contacts: Contact[] = [...seedContacts]

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchContacts(): Promise<Contact[]> {
  await delay(LATENCY_MS)
  return [...contacts]
}

export async function createContact(input: ContactInput): Promise<Contact> {
  await delay(LATENCY_MS)
  const contact: Contact = { id: crypto.randomUUID(), ...input }
  contacts = [...contacts, contact]
  return contact
}
