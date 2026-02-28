<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { twMerge } from 'tailwind-merge'

import { DialogTitle, useForwardProps, type DialogTitleProps } from 'reka-ui'

import { baseDialogTitleVariation } from './index'

const props = defineProps<DialogTitleProps & { class?: string }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DialogTitle v-bind="forwardedProps" :class="twMerge(baseDialogTitleVariation(), props.class)">
    <slot />
  </DialogTitle>
</template>
