<script setup lang="ts">
import { computed, provide } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { twMerge } from 'tailwind-merge'

import { Primitive, useForwardProps, type PrimitiveProps } from 'reka-ui'

import {
  toggleButtonVariation,
  type ToggleButtonVariation,
  TOGGLE_BUTTON_CONTEXT_KEY,
} from './index'

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      size?: ToggleButtonVariation['size']
      class?: string
    }
  >(),
  {
    as: 'button',
    size: 'medium',
    class: '',
  },
)

const modelValue = defineModel<boolean>({ default: false })

const dataState = computed(() => (modelValue.value ? 'on' : 'off'))

function toggle() {
  modelValue.value = !modelValue.value
}

provide(TOGGLE_BUTTON_CONTEXT_KEY, { pressed: modelValue })

const delegatedProps = reactiveOmit(props, 'size', 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <Primitive
    v-bind="forwarded"
    role="switch"
    :aria-checked="modelValue"
    :data-state="dataState"
    :class="twMerge(toggleButtonVariation({ size: props.size }), props.class)"
    @click="toggle"
  >
    <slot />
  </Primitive>
</template>
