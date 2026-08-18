import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

interface RouterContext {
  queryClient: QueryClient
}

/* The shell stays empty: the home page and the project overlay each
   carry their own chrome, per the two-section design in docs/DESIGN.md. */
export const Route = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
})
