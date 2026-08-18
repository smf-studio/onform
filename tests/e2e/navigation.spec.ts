import { expect, test } from '@playwright/test'

test.describe('navigation', () => {
  test('home page renders and links to the example feature', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: 'Frontend Template' }),
    ).toBeVisible()

    await page.getByRole('link', { name: 'Open the example' }).click()
    await expect(page).toHaveURL(/\/contacts$/)
    await expect(page.getByRole('heading', { name: 'Contacts' })).toBeVisible()
  })

  test('unknown routes show the not-found fallback', async ({ page }) => {
    await page.goto('/no-such-page')
    await expect(page.getByText('Page not found')).toBeVisible()
  })

  test('theme toggle switches dark mode', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')
    await expect(html).not.toHaveClass(/dark/)

    await page.getByRole('button', { name: 'Switch to dark mode' }).click()
    await expect(html).toHaveClass(/dark/)

    // The choice persists across reloads (localStorage-backed atom).
    await page.reload()
    await expect(html).toHaveClass(/dark/)
  })
})
