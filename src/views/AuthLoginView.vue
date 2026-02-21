<script setup lang="ts">
import type { Component } from 'vue'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useLoginMutation } from '@/composables/useAuth'
import { AUTH_CONNECTOR, type AuthConnector } from '@/types/auth'

import IconBoltFill from '@/assets/icons/bolt-fill.svg'
import IconGoogle from '@/assets/icons/google.svg'
import IconApple from '@/assets/icons/apple.svg'

const route = useRoute()
const router = useRouter()
const { login, isPending } = useLoginMutation()

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

// Capture at setup time before the query is cleared.
const errorCode = route.query.error as string | undefined
const errorDescription = route.query.error_description as string | undefined

const authError = errorCode
  ? errorDescription || ERROR_MESSAGES[errorCode] || 'Sign-in failed. Please try again.'
  : null

onMounted(() => {
  if (errorCode) {
    router.replace({ ...route, query: {} })
  }
})
</script>

<template>
  <div class="w-full max-w-92 flex flex-col items-center">
    <div class="bolt-wrapper mb-14">
      <IconBoltFill aria-hidden="true" class="bolt size-18 text-primary" />
      <IconBoltFill aria-hidden="true" class="bolt-sheen size-18 text-primary" />
    </div>

    <div class="flex flex-col items-center gap-1 animate-[fade-in-bottom_0.5s_ease-out_both] mb-10">
      <h1 class="text-4xl text-primary font-semibold">Pulse</h1>
      <p class="text-sm text-muted-foreground font-light">Track Your Momentum</p>
    </div>

    <Transition name="auth-swap" mode="out-in">
      <div v-if="!isPending" key="content" class="grid w-full">
        <div class="overflow-hidden min-h-0">
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

      <div v-else key="spinner" class="grid">
        <div class="overflow-hidden min-h-0 flex justify-center mb-6 py-3">
          <div
            class="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.auth-swap-leave-active,
.auth-swap-enter-active {
  transition:
    grid-template-rows 0.25s ease,
    opacity 0.25s ease;
}

.auth-swap-leave-from,
.auth-swap-enter-to {
  grid-template-rows: 1fr;
}

.auth-swap-leave-to,
.auth-swap-enter-from {
  grid-template-rows: 0fr;
  opacity: 0;
}

.bolt-wrapper {
  position: relative;
  display: inline-flex;
}

.bolt {
  animation: bolt-reveal 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@property --bolt-sweep {
  syntax: '<percentage>';
  inherits: false;
  initial-value: -40%;
}

.bolt-sheen {
  position: absolute;
  inset: 0;
  filter: brightness(3);
  mask-image: linear-gradient(
    to bottom,
    transparent calc(var(--bolt-sweep) - 20%),
    white var(--bolt-sweep),
    white calc(var(--bolt-sweep) + 20%),
    transparent calc(var(--bolt-sweep) + 40%)
  );
  animation: bolt-flash 2.5s ease-in-out 0.8s both infinite;
}

@keyframes bolt-reveal {
  from {
    clip-path: inset(0 0 100% 0);
  }
  to {
    clip-path: inset(0 0 0% 0);
  }
}

@keyframes bolt-flash {
  0%,
  41%,
  100% {
    --bolt-sweep: -40%;
    opacity: 0;
  }
  5% {
    --bolt-sweep: -20%;
    opacity: 1;
  }
  35% {
    --bolt-sweep: 120%;
    opacity: 1;
  }
  40% {
    --bolt-sweep: 140%;
    opacity: 0;
  }
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
