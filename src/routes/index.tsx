import { createFileRoute, Link } from '@tanstack/react-router'

import { PageHeader } from 'components/shared/PageHeader'
import { Button } from 'components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'components/ui/card'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        description="A production-grade starting point: Vite, React, TypeScript, Tailwind, shadcn/ui, TanStack Router + Query, Jotai, react-hook-form and zod — wired together and enforced by tooling."
        title="Frontend Template"
      />
      <Card>
        <CardHeader>
          <CardTitle>Example feature: Contacts</CardTitle>
          <CardDescription>
            The reference implementation new features should copy: a route with
            a loader, a query options factory, a validated form built from
            shadcn primitives, a co-located Jotai atom, unit-tested utilities
            and a Playwright flow test.
          </CardDescription>
        </CardHeader>
        <CardHeader>
          <Button asChild className="w-fit">
            <Link to="/contacts">Open the example</Link>
          </Button>
        </CardHeader>
      </Card>
    </div>
  )
}
