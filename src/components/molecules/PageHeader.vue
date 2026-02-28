<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <header
    :class="twMerge('relative z-20 px-safe pt-safe pb-4 flex flex-col gap-3 shrink-0', props.class)"
  >
    <slot />
  </header>
</template>
