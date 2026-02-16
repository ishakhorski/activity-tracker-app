<script setup lang="ts">
import { type HTMLAttributes, provide, ref } from 'vue'
import { twMerge } from 'tailwind-merge'

import {
  segmentedControlVariation,
  type SegmentedControlVariation,
  SEGMENTED_CONTROL_CONTEXT_KEY,
} from './index'

const props = withDefaults(
  defineProps<{
    size?: SegmentedControlVariation['size']
    class?: HTMLAttributes['class']
  }>(),
  {
    size: 'medium',
  },
)

const modelValue = defineModel<string>({ required: true })

const values = ref<string[]>([])

function register(value: string) {
  if (!values.value.includes(value)) {
    values.value.push(value)
  }
}

function unregister(value: string) {
  const index = values.value.indexOf(value)
  if (index >= 0) {
    values.value.splice(index, 1)
  }
}

function select(value: string) {
  modelValue.value = value
}

provide(SEGMENTED_CONTROL_CONTEXT_KEY, {
  modelValue,
  size: props.size,
  values,
  register,
  unregister,
  select,
})
</script>

<template>
  <div
    role="tablist"
    :class="twMerge(segmentedControlVariation({ size: props.size }), props.class)"
  >
    <slot />
  </div>
</template>
