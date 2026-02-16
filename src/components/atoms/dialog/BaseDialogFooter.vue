<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { twMerge } from 'tailwind-merge'

import { baseDialogFooterVariation } from './index'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div :class="twMerge(baseDialogFooterVariation(), props.class)">
    <slot />
  </div>
</template>
