import { defineConfig, devices } from '@playwright/test'

/* A dedicated e2e port, deliberately not the 5173 dev default: the suite
   always starts its own server, so sharing a port with `pnpm dev` would make
   the two fight. Override with E2E_PORT if 5273 is taken too.
   See docs/GOTCHAS.md. */
const PORT = Number(process.env.E2E_PORT ?? 5273)

/* Escape hatch for sandboxed environments that ship a preinstalled
   Chromium instead of allowing `playwright install` downloads.
   See docs/GOTCHAS.md. */
const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_PATH

export default defineConfig({
  forbidOnly: process.env.CI !== undefined,
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: [['list']],
  retries: process.env.CI === undefined ? 0 : 2,
  testDir: './tests/e2e',
  use: {
    baseURL: `http://localhost:${String(PORT)}`,
    trace: 'on-first-retry',
    ...(chromiumPath === undefined
      ? {}
      : { launchOptions: { executablePath: chromiumPath } }),
  },
  webServer: {
    command: `pnpm dev --port ${String(PORT)} --strictPort`,
    /* Never reuse a server this config did not start. Reuse cannot tell our
       app from a stranger's on the same port, so a squatted port silently
       ran the whole suite against someone else's site. With reuse off,
       --strictPort turns that into an immediate "port is already in use"
       instead of 7 misleading element-not-found timeouts. */
    reuseExistingServer: false,
    url: `http://localhost:${String(PORT)}`,
  },
})
