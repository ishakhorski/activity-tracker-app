import { inject, ref, type App, type Plugin, type Ref } from 'vue'
import { type Router } from 'vue-router'
import {
  createAuth0Client,
  type LogoutOptions,
  type RedirectLoginOptions,
  type User,
} from '@auth0/auth0-spa-js'

import { AUTH_ROLE } from '@/types/auth'

const AUTH0_KEY = Symbol('auth0')

export interface Auth0State {
  isAuthenticated: Ref<boolean>
  user: Ref<User | undefined>
  loginWithRedirect: (options?: RedirectLoginOptions) => Promise<void>
  logout: (options?: LogoutOptions) => Promise<void>
  getAccessTokenSilently: () => Promise<string>
  handleRedirectCallback: () => Promise<void>
}

export const useAuth0 = (): Auth0State => {
  const auth = inject<Auth0State>(AUTH0_KEY)
  if (!auth) throw new Error('useAuth0 requires the auth0Plugin')
  return auth
}

export const createAuth0Plugin = async (router: Router): Promise<Plugin> => {
  const isAuthenticated = ref(false)
  const user = ref<User | undefined>(undefined)

  const client = await createAuth0Client({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: `${window.location.origin}/auth/callback`,
    },
    useRefreshTokens: true,
    cacheLocation: 'localstorage',
  })

  isAuthenticated.value = await client.isAuthenticated()
  user.value = isAuthenticated.value ? await client.getUser() : undefined

  router.beforeEach((to) => {
    const roles = to.meta.roles
    if (!roles) return

    const role = isAuthenticated.value ? AUTH_ROLE.USER : AUTH_ROLE.PUBLIC
    if (roles.includes(role)) return

    return isAuthenticated.value ? { name: 'activities-view' } : { name: 'login' }
  })

  return {
    install(app: App) {
      app.provide(AUTH0_KEY, {
        isAuthenticated,
        user,
        loginWithRedirect: (opts) => client.loginWithRedirect(opts),
        logout: (opts) => client.logout(opts),
        getAccessTokenSilently: () => client.getTokenSilently(),
        handleRedirectCallback: async () => {
          await client.handleRedirectCallback()
          isAuthenticated.value = await client.isAuthenticated()
          user.value = isAuthenticated.value ? await client.getUser() : undefined
        },
      } satisfies Auth0State)
    },
  }
}
