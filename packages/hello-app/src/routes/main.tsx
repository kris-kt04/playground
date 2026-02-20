import React from 'react';
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { QueryClient,QueryClientProvider } from '@tanstack/react-router'
import { ThemeProvider } from '../components/theme-provider';
import type { ReactNode } from 'react'
import '@/styles/globals.css';

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
      { rel: 'stylesheet', href: style, }
    ],
  }),
  component: RootComponent,
  loader: () => getThemeServerFn(),
})


const Providers = ({ children }: Readonly<{ children: ReactNode }>) => {
  const data = Route.useLoaderData();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={data}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const theme = Route.useLoaderData();


  return (
    <html className={theme} suppressHydrationWarning >
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
        <Scripts />
      </body>
    </html>
  );
}