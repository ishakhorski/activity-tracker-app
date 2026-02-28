<script setup lang="ts">
import { computed, inject } from 'vue'
import { twMerge } from 'tailwind-merge'

import IconPlus from '@/assets/icons/plus.svg?component'

import { numberStepperButtonVariation, NUMBER_STEPPER_CONTEXT_KEY } from './index'

const props = defineProps<{
  class?: string
}>()

const context = inject(NUMBER_STEPPER_CONTEXT_KEY)
if (!context) {
  throw new Error('BaseNumberStepperIncreaseButton must be used within a BaseNumberStepper')
}

const resolvedSize = computed(() => context.size)
</script>

<template>
  <button
    :disabled="!context.canIncrement.value"
    :class="twMerge(numberStepperButtonVariation({ size: resolvedSize }), props.class)"
    @click="context.increment"
  >
    <slot>
      <IconPlus />
    </slot>
  </button>
</template>
