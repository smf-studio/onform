import { z } from 'zod'

export const contactInputSchema = z.object({
  email: z.email('Enter a valid email address'),
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  notes: z.string().trim().max(500, 'Notes must be 500 characters or fewer'),
})

export type ContactInput = z.infer<typeof contactInputSchema>

export interface Contact extends ContactInput {
  id: string
}
