import { getRouter } from './router'
import { createMemoryHistory } from '@tanstack/react-router'
import { renderToString } from 'react-dom/server'

export async function render(url: string) {
  const router = createRouter({
    history: createMemoryHistory({
      initialEntries: [url],
    }),
  })

  await router.warmIntentionallyDelayedPromises()

  const html = renderToString(<router.RootComponent />)

  return html
}

function createRouter(options: any) {
  return getRouter()
}
