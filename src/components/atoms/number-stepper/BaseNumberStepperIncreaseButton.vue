<script setup lang="ts">
import { type HTMLAttributes, computed, inject } from 'vue'
import { twMerge } from 'tailwind-merge'

import IconPlus from '@/assets/icons/plus.svg'

import { numberStepperButtonVariation, NUMBER_STEPPER_CONTEXT_KEY } from './index'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const context = inject(NUMBER_STEPPER_CONTEXT_KEY)!

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
