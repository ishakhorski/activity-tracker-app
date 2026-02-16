<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { twMerge } from 'tailwind-merge'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <header
    :class="twMerge('relative z-20 px-safe pt-safe pb-4 flex flex-col gap-3 shrink-0', props.class)"
  >
    <slot />
  </header>
</template>
