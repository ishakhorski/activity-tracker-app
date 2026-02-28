<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

import { baseDialogFooterVariation } from './index'

const props = withDefaults(defineProps<{ class?: string }>(), { class: '' })
</script>

<template>
  <div :class="twMerge(baseDialogFooterVariation(), props.class)">
    <slot />
  </div>
</template>
