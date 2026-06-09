import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  useLocation,
} from '@tanstack/react-router'

import '@/styles/global.css';
// import { ThemeProvider } from '@/components/theme-provider'
import { getThemeServerFn } from '@/lib/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navbar } from '@/components/navbar'
import { Theme } from "@radix-ui/themes";



const queryClient = new QueryClient();
export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'PlayGround',
      },
    ],
    links: [
      { rel: 'stylesheet', href: '/styles/global.css' }
    ],
  }),
  component: RootComponent,
  // beforeLoad: async () => {
  //     throw redirect({to: '/dashboard'});
  //   },
  loader: () => getThemeServerFn(),
})

const Providers = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Theme accentColor="crimson" grayColor="sand" radius="large" scaling="95%">
        {children}
      </Theme>
    </QueryClientProvider>
  )
}

function RootComponent() {
  const theme = Route.useLoaderData();
  const location = useLocation();
  const hideNavbar = ['/login', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <html className={theme} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {!hideNavbar && <Navbar />}
        <Providers>
          <Outlet />
        </Providers>
        <Scripts />
      </body>
    </html>
  )
}