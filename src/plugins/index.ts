import type { App, Plugin } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'

import { auth0Plugin } from './auth0Plugin'
import './mockApiPlugin' // initialize mock API

const plugins: Plugin[] = [auth0Plugin, VueQueryPlugin]

export async function registerPlugins(app: App): Promise<void> {
  for (const plugin of plugins) {
    app.use(plugin)
  }
}
