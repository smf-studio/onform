import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'config/env'
import 'styles/globals.css'
import { Providers } from 'app/Providers'
import { router } from 'app/router'

const rootElement = document.getElementById('root')
if (rootElement === null) {
  throw new Error('Root element "#root" is missing from index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
)
