import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import { createContact, fetchContacts } from 'features/contacts/api'

/* queryOptions factories are the single source of truth for query keys
   and fetchers. Route loaders (ensureQueryData) and components
   (useSuspenseQuery) both consume the same factory. */
export const contactsQueryOptions = () =>
  queryOptions({
    queryFn: fetchContacts,
    queryKey: ['contacts'],
  })

export function useCreateContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createContact,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: contactsQueryOptions().queryKey,
      }),
  })
}
