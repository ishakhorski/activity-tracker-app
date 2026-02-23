import type { App } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'

import router from '@/router'
import { createAuth0Plugin } from './auth0Plugin'

import './mockApiPlugin'

export async function registerPlugins(app: App): Promise<void> {
  const auth0Plugin = await createAuth0Plugin(router)
  const plugins = [router, auth0Plugin, VueQueryPlugin]

  for (const plugin of plugins) {
    app.use(plugin)
  }
}
