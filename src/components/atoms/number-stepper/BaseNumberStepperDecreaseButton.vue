<script setup lang="ts">
import { computed, inject } from 'vue'
import { twMerge } from 'tailwind-merge'

import IconMinus from '@/assets/icons/minus.svg?component'

import { numberStepperButtonVariation, NUMBER_STEPPER_CONTEXT_KEY } from './index'

const props = defineProps<{
  class?: string
}>()

const context = inject(NUMBER_STEPPER_CONTEXT_KEY)
if (!context) {
  throw new Error('BaseNumberStepperDecreaseButton must be used within a BaseNumberStepper')
}

const resolvedSize = computed(() => context.size)
</script>

<template>
  <button
    :disabled="!context.canDecrement.value"
    :class="twMerge(numberStepperButtonVariation({ size: resolvedSize }), props.class)"
    @click="context.decrement"
  >
    <slot>
      <IconMinus />
    </slot>
  </button>
</template>
