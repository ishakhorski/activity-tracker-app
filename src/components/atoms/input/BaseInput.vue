<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

import { inputVariation } from './index'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: string
}>()

const modelValue = defineModel<string>()
</script>

<template>
  <input v-bind="$attrs" v-model="modelValue" :class="twMerge(inputVariation(), props.class)" />
</template>
