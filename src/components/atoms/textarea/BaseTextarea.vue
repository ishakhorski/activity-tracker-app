<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { twMerge } from 'tailwind-merge'

import { textareaVariation } from './index'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: HTMLAttributes['class']
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
