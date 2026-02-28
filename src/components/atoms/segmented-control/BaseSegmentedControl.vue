<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { twMerge } from 'tailwind-merge'

import {
  segmentedControlVariation,
  type SegmentedControlVariation,
  SEGMENTED_CONTROL_CONTEXT_KEY,
} from './index'

const props = withDefaults(
  defineProps<{
    size?: SegmentedControlVariation['size']
    class?: string
  }>(),
  {
    size: 'medium',
    class: '',
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

const activeIndex = computed(() => {
  const idx = values.value.indexOf(modelValue.value)
  return idx === -1 ? 0 : idx
})

const indicatorGap = computed(() => (props.size === 'large' ? 4 : 2))

const indicatorStyle = computed(() => {
  const gap = indicatorGap.value
  return {
    top: `${gap}px`,
    bottom: `${gap}px`,
    left: `${gap}px`,
    width: `calc((100% - ${gap * 2}px) / ${values.value.length})`,
    transform: `translateX(${activeIndex.value * 100}%)`,
  }
})

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
    :class="twMerge('relative', segmentedControlVariation({ size: props.size }), props.class)"
  >
    <div
      v-if="values.length > 0"
      aria-hidden="true"
      class="pointer-events-none absolute rounded-full glass bg-primary/15 ring-1 ring-white/20 transition-transform duration-300 ease-out"
      :style="indicatorStyle"
    />
    <slot />
  </div>
</template>
