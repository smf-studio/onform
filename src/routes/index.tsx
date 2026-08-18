import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from 'features/properties/components/HomePage'

export const Route = createFileRoute('/')({
  component: HomePage,
})
