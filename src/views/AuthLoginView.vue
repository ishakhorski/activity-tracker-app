<script setup lang="ts">
import { computed, onMounted, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppLogo from '@/components/molecules/AppLogo.vue'
import IconGoogle from '@/assets/icons/google.svg?component'
import IconApple from '@/assets/icons/apple.svg?component'

import { useAuth } from '@/composables/useAuth'
import { AUTH_CONNECTOR, type AuthConnector } from '@/types/auth'

const route = useRoute()
const router = useRouter()
const { login, isLoginPending } = useAuth()

const errorQuery = route.query.error as string | undefined
const errorDescriptionQuery = route.query.error_description as string | undefined

const providers: { connection: AuthConnector; label: string; icon: Component }[] = [
  { connection: AUTH_CONNECTOR.GOOGLE, label: 'Continue with Google', icon: IconGoogle },
  { connection: AUTH_CONNECTOR.APPLE, label: 'Continue with Apple', icon: IconApple },
]

const ERROR_MESSAGES: Record<string, string> = {
  access_denied: 'Access was denied. Please try again.',
  login_required: 'Your session expired. Please sign in again.',
  consent_required: 'Permission is required to continue.',
  interaction_required: 'Please complete the requested action to sign in.',
  unauthorized: 'You are not authorized to access this app.',
  callback_error: 'Something went wrong while completing sign-in.',
}

const authError = computed(() => {
  return errorQuery
    ? errorDescriptionQuery || ERROR_MESSAGES[errorQuery] || 'Sign-in failed. Please try again.'
    : null
})

onMounted(() => {
  if (errorQuery) {
    router.replace({ ...route, query: {} })
  }
})
</script>

<template>
  <div class="w-full max-w-92 flex flex-col items-center">
    <AppLogo class="size-18 mb-14" />

    <div class="flex flex-col items-center gap-1 animate-[fade-in-bottom_0.5s_ease-out_both] mb-10">
      <h1 class="text-4xl text-primary font-semibold">Pulse</h1>
      <p class="text-sm text-muted-foreground font-light">Track Your Momentum</p>
    </div>

    <Transition name="auth-swap" mode="out-in">
      <div v-if="!isLoginPending" key="content" class="grid w-full">
        <div class="overflow-hidden min-h-14">
          <p v-if="authError" class="text-xs text-center text-destructive mb-4">{{ authError }}</p>

          <p v-else class="text-xs text-center text-muted-foreground mb-2">Sign in to continue</p>

          <div class="w-full flex flex-col gap-3 mb-6">
            <button
              v-for="provider in providers"
              :key="provider.connection"
              class="glass flex items-center justify-center gap-3 w-full rounded-2xl px-5 py-3.5 text-[15px] font-medium text-foreground hover:glass-hover active:scale-[0.98] transition-all"
              @click="login(provider.connection)"
            >
              <component :is="provider.icon" class="size-6 shrink-0" />
              <span>{{ provider.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <div v-else key="spinner" class="flex justify-center py-3">
        <div
          class="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.auth-swap-leave-active {
  transition:
    grid-template-rows 0.25s ease,
    opacity 0.25s ease;
}

.auth-swap-enter-active {
  transition: opacity 0.25s ease;
}

.auth-swap-leave-from {
  grid-template-rows: 1fr;
}

.auth-swap-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}

.auth-swap-enter-from {
  opacity: 0;
}
</style>

<style>
@keyframes fade-in-bottom {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
