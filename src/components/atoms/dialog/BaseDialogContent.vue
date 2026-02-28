<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { twMerge } from 'tailwind-merge'

import {
  DialogClose,
  DialogContent,
  DialogPortal,
  useForwardPropsEmits,
  type DialogContentEmits,
  type DialogContentProps,
} from 'reka-ui'

import IconClose from '@/assets/icons/close.svg?component'

import BaseDialogOverlay from './BaseDialogOverlay.vue'
import { baseDialogCloseButtonVariation, baseDialogContentVariation } from './index'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DialogContentProps & { class?: string }>(), {
  class: '',
})
const emits = defineEmits<DialogContentEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DialogPortal>
    <BaseDialogOverlay />
    <DialogContent
      v-bind="{ ...$attrs, ...forwarded }"
      :class="twMerge(baseDialogContentVariation(), props.class)"
    >
      <slot />

      <DialogClose :class="baseDialogCloseButtonVariation()">
        <IconClose class="size-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
