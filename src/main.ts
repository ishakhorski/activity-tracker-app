import { createApp } from 'vue'

import '@/assets/main.css'

import App from './App.vue'
import { registerPlugins } from './plugins'

async function bootstrap() {
  const app = createApp(App)
  await registerPlugins(app)
  app.mount('#app')
}

void bootstrap()
