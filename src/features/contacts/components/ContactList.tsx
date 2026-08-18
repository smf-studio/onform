import { useSuspenseQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import { EmptyState } from 'components/shared/EmptyState'
import { Card, CardContent } from 'components/ui/card'
import { Input } from 'components/ui/input'
import { contactsFilterAtom } from 'features/contacts/atoms'
import { contactsQueryOptions } from 'features/contacts/queries'
import { filterContacts, getInitials } from 'features/contacts/utils'

export function ContactList() {
  const { data: contacts } = useSuspenseQuery(contactsQueryOptions())
  const [filter, setFilter] = useAtom(contactsFilterAtom)
  const visibleContacts = filterContacts(contacts, filter)

  return (
    <div className="flex flex-col gap-4">
      <Input
        aria-label="Filter contacts"
        onChange={(event) => {
          setFilter(event.target.value)
        }}
        placeholder="Filter by name or email…"
        value={filter}
      />
      {visibleContacts.length === 0 ? (
        <EmptyState
          description="Try a different search term."
          title="No contacts found"
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {visibleContacts.map((contact) => (
            <li key={contact.id}>
              <Card className="py-3">
                <CardContent className="flex items-center gap-3 px-4">
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
                  >
                    {getInitials(contact.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {contact.name}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {contact.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
