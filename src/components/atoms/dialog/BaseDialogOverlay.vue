<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { twMerge } from 'tailwind-merge'

import { DialogOverlay, type DialogOverlayProps } from 'reka-ui'

import { baseDialogOverlayVariation } from './index'

const props = defineProps<DialogOverlayProps & { class?: string }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <DialogOverlay
    v-bind="delegatedProps"
    :class="twMerge(baseDialogOverlayVariation(), props.class)"
  >
    <slot />
  </DialogOverlay>
</template>
