import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  redirect,
} from '@tanstack/react-router'

import '@/styles/global.css';
import { ThemeProvider } from '@/components/theme-provider'
import { getThemeServerFn } from '@/lib/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


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
        title: 'H010',
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
  const data = Route.useLoaderData();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme={data}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

function RootComponent() {
  const theme = Route.useLoaderData();

  return (
    <html className={theme} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>
          <Outlet />
        </Providers>
        <Scripts />
      </body>
    </html>
  )
}