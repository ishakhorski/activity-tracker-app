import { createApp } from 'vue'

import '@/assets/main.css'

import App from './App.vue'
import router from './router'

import { registerPlugins } from './plugins'

async function bootstrap() {
  const app = createApp(App)
  app.use(router)

  registerPlugins(app)

  app.mount('#app')
}

void bootstrap()
