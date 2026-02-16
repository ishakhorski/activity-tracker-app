<script setup lang="ts">
import { type HTMLAttributes, computed, provide } from 'vue'
import { twMerge } from 'tailwind-merge'

import {
  numberStepperVariation,
  type NumberStepperVariation,
  NUMBER_STEPPER_CONTEXT_KEY,
} from './index'

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    size?: NumberStepperVariation['size']
    class?: HTMLAttributes['class']
  }>(),
  {
    min: 1,
    max: undefined,
    size: 'medium',
  },
)

const modelValue = defineModel<number>({ required: true })

const canDecrement = computed(() => modelValue.value > props.min)
const canIncrement = computed(() => props.max === undefined || modelValue.value < props.max)

function decrement() {
  if (canDecrement.value) modelValue.value = modelValue.value - 1
}

function increment() {
  if (canIncrement.value) modelValue.value = modelValue.value + 1
}

function updateValue(value: number) {
  const clamped = Math.max(props.min, props.max !== undefined ? Math.min(value, props.max) : value)
  modelValue.value = clamped
}

provide(NUMBER_STEPPER_CONTEXT_KEY, {
  modelValue,
  min: props.min,
  max: props.max,
  size: props.size,
  canDecrement,
  canIncrement,
  decrement,
  increment,
  updateValue,
})
</script>

<template>
  <div :class="twMerge(numberStepperVariation({ size: props.size }), props.class)">
    <slot />
  </div>
</template>
