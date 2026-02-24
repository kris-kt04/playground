import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hi')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/hi"!</div>
}
