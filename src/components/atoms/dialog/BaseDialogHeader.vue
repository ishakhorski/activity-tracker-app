<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

import { baseDialogHeaderVariation } from './index'

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <div :class="twMerge(baseDialogHeaderVariation(), props.class)">
    <slot />
  </div>
</template>
