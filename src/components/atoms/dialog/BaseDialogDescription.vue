<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { twMerge } from 'tailwind-merge'

import { DialogDescription, useForwardProps, type DialogDescriptionProps } from 'reka-ui'

import { baseDialogDescriptionVariation } from './index'

const props = defineProps<DialogDescriptionProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DialogDescription
    v-bind="forwardedProps"
    :class="twMerge(baseDialogDescriptionVariation(), props.class)"
  >
    <slot />
  </DialogDescription>
</template>
