<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

import { textareaVariation } from './index'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const modelValue = defineModel<string>()
</script>

<template>
  <textarea
    v-bind="$attrs"
    v-model="modelValue"
    :class="twMerge(textareaVariation(), props.class)"
  />
</template>
