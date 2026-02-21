<script setup lang="ts">
import type { Component } from 'vue'

import { useLoginMutation } from '@/composables/useAuth'
import { AUTH_CONNECTOR, type AuthConnector } from '@/types/auth'

import IconTally from '@/assets/icons/tally.svg'
import IconGoogle from '@/assets/icons/google.svg'
import IconApple from '@/assets/icons/apple.svg'

const { login, isPending } = useLoginMutation()

const providers: { connection: AuthConnector; label: string; icon: Component }[] = [
  { connection: AUTH_CONNECTOR.GOOGLE, label: 'Continue with Google', icon: IconGoogle },
  { connection: AUTH_CONNECTOR.APPLE, label: 'Continue with Apple', icon: IconApple },
]
</script>

<template>
  <div class="w-full max-w-92 flex flex-col items-center">
    <IconTally aria-hidden="true" class="tally size-18 text-primary mb-14" />

    <div class="flex flex-col items-center gap-1 animate-[fade-in-bottom_0.5s_ease-out_both] mb-10">
      <h1 class="text-4xl text-primary font-semibold">Tally</h1>
      <p class="text-sm text-muted-foreground font-light">Track Your Momentum</p>
    </div>

    <p class="text-xs text-center text-muted-foreground mb-2">Sign in to continue</p>
    <div class="w-full flex flex-col gap-3 mb-6">
      <button
        v-for="provider in providers"
        :key="provider.connection"
        :disabled="isPending"
        class="glass flex items-center justify-center gap-3 w-full rounded-2xl px-5 py-3.5 text-[15px] font-medium text-foreground hover:glass-hover active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 transition-all"
        @click="login(provider.connection)"
      >
        <component :is="provider.icon" class="size-6 shrink-0" />
        <span>{{ provider.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.tally :deep(path) {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;

  --draw: 0.25s;
  --gap: 0.1s;
  --step: calc(var(--draw) + var(--gap));

  animation: tally-draw var(--draw) ease-in-out forwards;
  animation-delay: calc(var(--i) * var(--step));
}

@keyframes tally-draw {
  to {
    stroke-dashoffset: 0;
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
