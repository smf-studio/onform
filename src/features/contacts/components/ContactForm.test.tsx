import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import '@testing-library/jest-dom/vitest'

import { ContactForm } from 'features/contacts/components/ContactForm'

/* Example component test. Keep these rare — user flows belong in
   Playwright (tests/e2e/); Vitest is for utilities and pure logic. */
function renderContactForm() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <ContactForm />
    </QueryClientProvider>,
  )
}

describe('ContactForm', () => {
  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup()
    renderContactForm()

    await user.click(screen.getByRole('button', { name: 'Add contact' }))

    expect(
      await screen.findByText('Name must be at least 2 characters'),
    ).toBeInTheDocument()
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
  })
})
