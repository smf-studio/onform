import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

import { SmoothScroll } from 'app/SmoothScroll'

interface RouterContext {
  queryClient: QueryClient
}

/* The shell stays minimal: the home page and the project pages each
   carry their own chrome, per the two-section design in docs/DESIGN.md. */
export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <SmoothScroll />
      <Outlet />
    </>
  )
}
