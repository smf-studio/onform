/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

/* Bare absolute imports: `components/ui/button` resolves to `src/components/ui/button`.
   Keep this list in sync with the top-level directories of src/ (and with
   tsconfig `baseUrl` + tests/tsconfig.json `paths`). */
const srcDirs = [
  'app',
  'components',
  'config',
  'data',
  'features',
  'lib',
  'routes',
  'styles',
]

export default defineConfig({
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: srcDirs.map((dir) => ({
      find: dir,
      replacement: path.resolve(import.meta.dirname, 'src', dir),
    })),
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
  },
})
