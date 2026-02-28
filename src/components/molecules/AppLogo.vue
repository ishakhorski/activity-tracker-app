<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

import IconBoltFill from '@/assets/icons/bolt-fill.svg?component'

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <div :class="twMerge('bolt-logo', props.class)">
    <IconBoltFill aria-hidden="true" class="bolt size-full text-primary" />
    <IconBoltFill aria-hidden="true" class="bolt-sheen size-full text-primary" />
  </div>
</template>

<style scoped>
.bolt-logo {
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
  animation: bolt-flash 2.5s ease-in-out 0.8s both;
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
