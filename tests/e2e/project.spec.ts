import { expect, test } from '@playwright/test'

test.describe('project overlay', () => {
  test('opens a property from its showcase row and shows the full set', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'VIEW ALL 20 FRAMES' }).first().click()

    await expect(page).toHaveURL(/\/projects\/queenscliff$/)
    await expect(
      page.getByRole('heading', { name: 'Queenscliff' }),
    ).toBeVisible()
    await expect(page.getByText('20 FRAMES')).toBeVisible()
    await expect(page.getByText('FROM THE WIDER SET')).toBeVisible()
  })

  test('is deep linkable and chains to the next project', async ({ page }) => {
    await page.goto('/projects/the-glebe')
    await expect(page.getByRole('heading', { name: 'The Glebe' })).toBeVisible()

    await page.getByRole('link', { name: /^NEXT/ }).click()
    await expect(page).toHaveURL(/\/projects\/valriche-villa$/)
    await expect(
      page.getByRole('heading', { name: 'Villa Valriche' }),
    ).toBeVisible()
  })

  test('close returns to the home page', async ({ page }) => {
    await page.goto('/projects/radnor-mews')
    await page.getByRole('link', { name: 'Back to all projects' }).click()
    await expect(page).toHaveURL(/\/(#radnor-mews)?$/)
    await expect(
      page.getByRole('region', { name: 'Featured property' }),
    ).toBeVisible()
  })

  test('unknown slugs show the not-found fallback', async ({ page }) => {
    await page.goto('/projects/no-such-property')
    await expect(page.getByText('Page not found')).toBeVisible()
  })
})
