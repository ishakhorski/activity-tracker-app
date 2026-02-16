<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { twMerge } from 'tailwind-merge'

import { baseDialogHeaderVariation } from './index'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="twMerge(baseDialogHeaderVariation(), props.class)">
    <slot />
  </div>
</template>
