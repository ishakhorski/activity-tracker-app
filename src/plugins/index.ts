import type { App, Plugin } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'

import './mockApiPlugin' // initialize mock API

const plugins: Plugin[] = [VueQueryPlugin]

export function registerPlugins(app: App): void {
  for (const plugin of plugins) {
    app.use(plugin)
  }
}
