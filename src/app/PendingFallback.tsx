import { LoaderCircle } from 'lucide-react'

export function PendingFallback() {
  return (
    <div
      aria-label="Loading"
      className="flex items-center justify-center py-16"
      role="status"
    >
      <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}
