import { ref } from 'vue'

import { useAuth0 } from '@/plugins/auth0Plugin'
import { type AuthConnector } from '@/types/auth'

export const useAuth = () => {
  const { isAuthenticated, user, loginWithRedirect, logout: auth0Logout } = useAuth0()

  const isLoginPending = ref(false)
  const isLogoutPending = ref(false)

  const login = async (connection: AuthConnector) => {
    isLoginPending.value = true
    try {
      await loginWithRedirect({ authorizationParams: { connection } })
    } catch {
      isLoginPending.value = false
    }
  }

  const logout = async () => {
    isLogoutPending.value = true
    try {
      await auth0Logout({ logoutParams: { returnTo: window.location.origin } })
    } catch {
      isLogoutPending.value = false
    }
  }

  return { isAuthenticated, user, login, isLoginPending, logout, isLogoutPending }
}
