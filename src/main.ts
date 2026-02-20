import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'

import '@/assets/main.css'

async function bootstrap() {
  if (import.meta.env.VITE_API_MOCK === 'true') {
    const { enableMockApi } = await import('@/services/mockApi')
    enableMockApi({ delay: Number(import.meta.env.VITE_API_MOCK_DELAY ?? 50) })
  }

  const app = createApp(App)
  app.use(VueQueryPlugin)
  app.use(router)
  app.mount('#app')
}

bootstrap()
