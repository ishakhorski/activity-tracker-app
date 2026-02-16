<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { twMerge } from 'tailwind-merge'

import { DialogTitle, useForwardProps, type DialogTitleProps } from 'reka-ui'

import { baseDialogTitleVariation } from './index'

const props = defineProps<DialogTitleProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DialogTitle v-bind="forwardedProps" :class="twMerge(baseDialogTitleVariation(), props.class)">
    <slot />
  </DialogTitle>
</template>
