import { expect, test } from '@playwright/test'

test.describe('home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows the wordmark, hero and all six project blocks', async ({
    page,
  }) => {
    await expect(
      page.getByRole('link', { name: 'onform', exact: true }),
    ).toBeVisible()
    await expect(
      page.getByRole('region', { name: 'Featured property' }),
    ).toBeVisible()

    for (const name of [
      'Queenscliff',
      'Radnor Mews',
      'Carlton Street',
      'The Glebe',
      'Villa Valriche',
      'Freshwater',
    ]) {
      await expect(
        page.getByRole('link', { name: `${name} project` }),
      ).toBeVisible()
    }
  })

  test('showcase shell shows the counter and active project facts', async ({
    page,
  }) => {
    await page
      .getByRole('link', { name: 'Queenscliff project' })
      .scrollIntoViewIfNeeded()
    await expect(page.getByText('of 06')).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Radnor Mews', exact: true }),
    ).toBeVisible()
  })

  test('metadata lines carry no ornament characters', async ({ page }) => {
    await page
      .getByRole('link', { name: 'Queenscliff project' })
      .scrollIntoViewIfNeeded()
    const meta = page.getByText(/Completed \d{4}/).first()
    await expect(meta).toBeVisible()
    const text = await meta.textContent()
    expect(text).toMatch(/^[A-Za-z0-9 ]+$/)
  })

  test('nav anchors scroll to projects and contact', async ({ page }) => {
    await page.getByRole('link', { name: 'CONTACT' }).click()
    await expect(page.locator('#contact')).toBeInViewport()

    await page.getByRole('link', { name: 'PROJECTS' }).click()
    await expect(page.locator('#projects')).toBeInViewport()
  })

  test('unknown routes show the not-found fallback', async ({ page }) => {
    await page.goto('/no-such-page')
    await expect(page.getByText('Page not found')).toBeVisible()
  })
})
