<script setup lang="ts">
import { type HTMLAttributes, computed, inject, onMounted, onUnmounted } from 'vue'
import { twMerge } from 'tailwind-merge'

import { segmentedControlButtonVariation, SEGMENTED_CONTROL_CONTEXT_KEY } from './index'

const props = defineProps<{
  value: string
  class?: HTMLAttributes['class']
}>()

const context = inject(SEGMENTED_CONTROL_CONTEXT_KEY)!

onMounted(() => context.register(props.value))
onUnmounted(() => context.unregister(props.value))

const isActive = computed(() => context.modelValue.value === props.value)
const resolvedSize = computed(() => context.size)

function handleClick() {
  context.select(props.value)
}

function handleKeydown(event: KeyboardEvent) {
  const values = context.values.value
  const currentIndex = values.indexOf(props.value)
  let nextIndex: number | undefined

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault()
    nextIndex = (currentIndex + 1) % values.length
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault()
    nextIndex = (currentIndex - 1 + values.length) % values.length
  } else if (event.key === 'Home') {
    event.preventDefault()
    nextIndex = 0
  } else if (event.key === 'End') {
    event.preventDefault()
    nextIndex = values.length - 1
  }

  const nextValue = nextIndex !== undefined ? values[nextIndex] : undefined
  if (nextValue) {
    context.select(nextValue)
    const el = (event.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLElement>(
      '[role="tab"]',
    )?.[nextIndex!]
    el?.focus()
  }
}
</script>

<template>
  <button
    role="tab"
    :aria-selected="isActive"
    :tabindex="isActive ? 0 : -1"
    :data-state="isActive ? 'active' : 'inactive'"
    :class="twMerge(segmentedControlButtonVariation({ size: resolvedSize }), props.class)"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot />
  </button>
</template>
