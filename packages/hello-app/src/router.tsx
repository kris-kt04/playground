import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router"

import HomePage from "./routes/index"

// Root layout
const rootRoute = createRootRoute({
  component: () => (
    <div>
      <Outlet />
    </div>
  ),
})

// Index route (/)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
})

// Build route tree
const routeTree = rootRoute.addChildren([indexRoute])

// Create router
export const router = createRouter({
  routeTree,
})

// Type registration (IMPORTANT for TypeScript)
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}