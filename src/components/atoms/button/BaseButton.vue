<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { twMerge } from 'tailwind-merge'

import { Primitive, useForwardProps, type PrimitiveProps } from 'reka-ui'

import { buttonVariation, type ButtonVariation } from './index'

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      variant?: ButtonVariation['variant']
      size?: ButtonVariation['size']
      class?: string
    }
  >(),
  {
    as: 'button',
    variant: 'primary',
    size: 'medium',
    class: '',
  },
)

const delegatedProps = reactiveOmit(props, 'variant', 'size', 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :class="twMerge(buttonVariation({ variant: props.variant, size: props.size }), props.class)"
  >
    <slot></slot>
  </Primitive>
</template>
