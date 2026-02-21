<script setup lang="ts">
import type { Component } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

import IconGoogle from '@/assets/icons/google.svg'
import IconApple from '@/assets/icons/apple.svg'
import TallyIcon from '@/components/icons/TallyIcon.vue'

const { loginWithRedirect, isLoading } = useAuth0()

const providers: { connection: string; label: string; icon: Component }[] = [
  { connection: 'google-oauth2', label: 'Continue with Google', icon: IconGoogle },
  { connection: 'apple', label: 'Continue with Apple', icon: IconApple },
]
</script>

<template>
  <div class="w-full max-w-sm flex flex-col items-center gap-10">
    <TallyIcon class="size-18 text-primary" aria-hidden="true" />

    <div class="flex flex-col items-center gap-1 login-title">
      <h1 class="app-name">Tally</h1>
      <p class="text-sm text-muted-foreground">Every completion counts</p>
    </div>

    <div class="flex flex-col gap-3 w-full">
      <p class="text-xs text-center text-muted-foreground -mb-1">Sign in to continue</p>
      <button
        v-for="provider in providers"
        :key="provider.connection"
        :disabled="isLoading"
        class="glass flex items-center justify-center gap-3 w-full rounded-2xl px-5 py-3.5 text-[15px] font-medium text-foreground hover:glass-hover active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 transition-all"
        @click="loginWithRedirect({ authorizationParams: { connection: provider.connection } })"
      >
        <component :is="provider.icon" class="size-6 shrink-0" />
        <span>{{ provider.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-title {
  animation: fade-up 0.55s cubic-bezier(0.32, 0.72, 0, 1) 0.3s both;
}

.app-name {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--primary);
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
