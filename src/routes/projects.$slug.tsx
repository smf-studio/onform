import { createFileRoute, notFound } from '@tanstack/react-router'

import { ProjectOverlay } from 'features/properties/components/ProjectOverlay'
import { getProperty } from 'features/properties/data'

/* Property data is static and validated at module load, so the loader
   only resolves the slug; unknown slugs fall through to the router's
   not-found boundary. */
export const Route = createFileRoute('/projects/$slug')({
  component: ProjectRoute,
  loader: ({ params }) => {
    const property = getProperty(params.slug)
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router's notFound() is a control-flow throw by design
    if (!property) throw notFound()
    return { property }
  },
})

function ProjectRoute() {
  const { property } = Route.useLoaderData()
  return <ProjectOverlay property={property} />
}
