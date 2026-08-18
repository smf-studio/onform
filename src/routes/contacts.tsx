import { createFileRoute } from '@tanstack/react-router'

import { ContactsPage } from 'features/contacts/components/ContactsPage'
import { contactsQueryOptions } from 'features/contacts/queries'

/* Routes stay thin: data loading is delegated to the feature's
   queryOptions factory, rendering to the feature's page component.
   Error, not-found and pending boundaries come from the router
   defaults configured in app/router.ts. */
export const Route = createFileRoute('/contacts')({
  component: ContactsPage,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(contactsQueryOptions()),
})
