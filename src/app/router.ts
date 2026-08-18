import { createRouter } from '@tanstack/react-router'

import { NotFoundFallback } from 'app/NotFoundFallback'
import { PendingFallback } from 'app/PendingFallback'
import { queryClient } from 'app/queryClient'
import { RouteErrorFallback } from 'app/RouteErrorFallback'

import { routeTree } from '../routeTree.gen'

export const router = createRouter({
  context: { queryClient },
  defaultErrorComponent: RouteErrorFallback,
  defaultNotFoundComponent: NotFoundFallback,
  defaultPendingComponent: PendingFallback,
  defaultPreload: 'intent',
  routeTree,
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
