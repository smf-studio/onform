import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from 'components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/form'
import { Input } from 'components/ui/input'
import { Textarea } from 'components/ui/textarea'
import { useCreateContact } from 'features/contacts/queries'
import { type ContactInput, contactInputSchema } from 'features/contacts/schema'

const defaultValues: ContactInput = {
  email: '',
  name: '',
  notes: '',
}

export function ContactForm() {
  const form = useForm<ContactInput>({
    defaultValues,
    resolver: zodResolver(contactInputSchema),
  })
  const createContact = useCreateContact()

  const onSubmit = form.handleSubmit(async (input) => {
    await createContact.mutateAsync(input)
    form.reset()
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a contact</CardTitle>
        <CardDescription>
          react-hook-form + zod, composed from shadcn primitives.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              void onSubmit(event)
            }}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ada Lovelace" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="ada@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Optional notes…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={createContact.isPending} type="submit">
              {createContact.isPending ? 'Adding…' : 'Add contact'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
