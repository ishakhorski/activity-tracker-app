<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { twMerge } from 'tailwind-merge'

import { inputVariation } from './index'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const modelValue = defineModel<string>()
</script>

<template>
  <input
    v-bind="$attrs"
    v-model="modelValue"
    :class="twMerge(inputVariation(), props.class)"
  />
</template>
