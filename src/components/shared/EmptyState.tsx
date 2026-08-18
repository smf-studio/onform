export function EmptyState({
  description,
  title,
}: {
  description?: string
  title: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed px-4 py-10 text-center text-muted-foreground">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description === undefined ? null : (
        <p className="text-sm">{description}</p>
      )}
    </div>
  )
}
