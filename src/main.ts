import { createApp } from 'vue'

import '@/assets/main.css'

import App from './App.vue'
import router from './router'
import { createAuth0Plugin } from './plugins/auth0Plugin'
import { registerPlugins } from './plugins'

async function bootstrap() {
  const app = createApp(App)

  app.use(router)
  app.use(await createAuth0Plugin())

  registerPlugins(app)

  app.mount('#app')
}

void bootstrap()
