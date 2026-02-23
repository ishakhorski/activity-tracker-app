<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { twMerge } from 'tailwind-merge'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div class="relative flex-1 min-h-0">
    <div
      class="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-background to-transparent"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-background to-transparent"
      aria-hidden="true"
    />

    <main :class="twMerge('h-full overflow-y-auto px-safe pt-4 pb-26', props.class)">
      <slot />
    </main>
  </div>
</template>
