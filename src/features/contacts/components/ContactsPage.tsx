import { PageHeader } from 'components/shared/PageHeader'
import { ContactForm } from 'features/contacts/components/ContactForm'
import { ContactList } from 'features/contacts/components/ContactList'

export function ContactsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        description="The reference feature. New features should copy this structure: schema, api, queries, atoms, utils and components, all co-located under features/contacts/."
        title="Contacts"
      />
      <div className="grid items-start gap-8 md:grid-cols-2">
        <ContactForm />
        <ContactList />
      </div>
    </div>
  )
}
