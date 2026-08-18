import { expect, test } from '@playwright/test'

test.describe('contacts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contacts')
  })

  test('shows the seeded contacts', async ({ page }) => {
    await expect(page.getByText('Ada Lovelace')).toBeVisible()
    await expect(page.getByText('Grace Hopper')).toBeVisible()
    await expect(page.getByText('Alan Turing')).toBeVisible()
  })

  test('adds a contact through the form', async ({ page }) => {
    await page.getByLabel('Name').fill('Katherine Johnson')
    await page.getByLabel('Email').fill('katherine@example.com')
    await page.getByLabel('Notes').fill('Calculated orbital mechanics.')
    await page.getByRole('button', { name: 'Add contact' }).click()

    await expect(page.getByText('Katherine Johnson')).toBeVisible()
    await expect(page.getByText('katherine@example.com')).toBeVisible()
    // The form resets after a successful submit.
    await expect(page.getByLabel('Name')).toHaveValue('')
  })

  test('rejects invalid input with field-level errors', async ({ page }) => {
    await page.getByLabel('Email').fill('not-an-email')
    await page.getByRole('button', { name: 'Add contact' }).click()

    await expect(
      page.getByText('Name must be at least 2 characters'),
    ).toBeVisible()
    await expect(page.getByText('Enter a valid email address')).toBeVisible()
    // Nothing was added to the list: the value only exists in the input,
    // never as rendered text on a contact card.
    await expect(page.getByLabel('Email')).toHaveValue('not-an-email')
    await expect(page.getByText('not-an-email')).toHaveCount(0)
  })

  test('filters the list by name or email', async ({ page }) => {
    const filter = page.getByLabel('Filter contacts')

    await filter.fill('ada')
    await expect(page.getByText('Ada Lovelace')).toBeVisible()
    await expect(page.getByText('Grace Hopper')).toBeHidden()

    await filter.fill('grace@')
    await expect(page.getByText('Grace Hopper')).toBeVisible()
    await expect(page.getByText('Ada Lovelace')).toBeHidden()

    await filter.fill('no-such-contact')
    await expect(page.getByText('No contacts found')).toBeVisible()
  })
})
