<script setup lang="ts">
import { type HTMLAttributes, computed, inject } from 'vue'
import { twMerge } from 'tailwind-merge'

import { numberStepperInputVariation, NUMBER_STEPPER_CONTEXT_KEY } from './index'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const context = inject(NUMBER_STEPPER_CONTEXT_KEY)!

const resolvedSize = computed(() => context.size)

function onInput(event: Event) {
  const value = parseInt((event.target as HTMLInputElement).value, 10)
  if (isNaN(value)) return
  context.updateValue(value)
}

function onBlur(event: FocusEvent) {
  const el = event.target as HTMLInputElement
  el.value = String(context.modelValue.value)
}
</script>

<template>
  <input
    type="number"
    :value="context.modelValue.value"
    :min="context.min"
    :max="context.max"
    :class="twMerge(numberStepperInputVariation({ size: resolvedSize }), props.class)"
    @input="onInput"
    @blur="onBlur"
  />
</template>
