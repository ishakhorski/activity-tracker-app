import { ref } from "vue";

import { useAuth0 } from "@/plugins/auth0Plugin";
import { type AuthConnector } from "@/types/auth";

export const useAuth = () => {
  const { isAuthenticated, user } = useAuth0();
  return { isAuthenticated, user };
};

export const useLoginMutation = () => {
  const { loginWithRedirect } = useAuth0();
  const isPending = ref(false);

  async function login(connection: AuthConnector) {
    isPending.value = true;
    try {
      await loginWithRedirect({ authorizationParams: { connection } });
    } catch {
      isPending.value = false;
    }
  }

  return { login, isPending };
};

export const useLogoutMutation = () => {
  const { logout } = useAuth0();
  const isPending = ref(false);

  async function signOut() {
    isPending.value = true;
    try {
      await logout({ logoutParams: { returnTo: window.location.origin } });
    } catch {
      isPending.value = false;
    }
  }

  return { signOut, isPending };
};
