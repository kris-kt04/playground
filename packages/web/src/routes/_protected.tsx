import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => {
    try {
      const session = await authClient.getSession()
      
      if (!session.data?.session) {
        throw redirect({ to: '/login' })
      }
      
      return { session: session.data.session }
    } catch (error) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => <Outlet />,
})