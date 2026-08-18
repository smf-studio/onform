import { type ErrorComponentProps, useRouter } from '@tanstack/react-router'

import { Button } from 'components/ui/button'

export function RouteErrorFallback({ error }: ErrorComponentProps) {
  const router = useRouter()

  return (
    <div
      className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center"
      role="alert"
    >
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <Button
        onClick={() => {
          void router.invalidate()
        }}
        variant="outline"
      >
        Try again
      </Button>
    </div>
  )
}
