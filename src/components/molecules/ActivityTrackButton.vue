<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { onLongPress, useCurrentElement } from '@vueuse/core'

import { BaseButton } from '@/components/atoms/button'
import type { ButtonVariation } from '@/components/atoms/button'
import IconBolt from '@/assets/icons/bolt.svg?component'
import IconBoltFill from '@/assets/icons/bolt-fill.svg?component'

const props = defineProps<{
  completed?: boolean
  size?: ButtonVariation['size']
}>()

const emit = defineEmits<{
  click: []
  'click:long-press': []
}>()

const el = useCurrentElement<HTMLButtonElement>()
const isAnimating = ref(false)
let longPressed = false

const handleClick = async () => {
  if (longPressed) {
    longPressed = false
    return
  }
  isAnimating.value = false
  await nextTick()
  isAnimating.value = true
  emit('click')
}

onLongPress(
  el,
  () => {
    longPressed = true
    emit('click:long-press')
  },
  { delay: 600, distanceThreshold: 8 },
)
</script>

<template>
  <BaseButton
    :size="props.size ?? 'large'"
    :variant="props.completed ? 'primary' : 'secondary'"
    class="relative"
    :class="{ 'is-animated': isAnimating }"
    @click="handleClick"
    @contextmenu.prevent
  >
    <IconBoltFill v-if="props.completed" class="bolt-icon" aria-hidden="true" />
    <IconBolt v-else class="bolt-icon" aria-hidden="true" />
    <slot></slot>
    <div v-if="isAnimating" class="track-anim-layer" />
  </BaseButton>
</template>

<style scoped>
@keyframes icon-shake {
  0%,
  100% {
    transform: rotate(0deg) translate(0, 0);
  }
  10% {
    transform: rotate(12deg) translate(1px, -1px);
  }
  20% {
    transform: rotate(-10deg) translate(-1.5px, 0.5px);
  }
  30% {
    transform: rotate(14deg) translate(1px, 0.5px);
  }
  40% {
    transform: rotate(-12deg) translate(-1px, -0.5px);
  }
  50% {
    transform: rotate(10deg) translate(0.5px, 1px);
  }
  60% {
    transform: rotate(-8deg) translate(-0.5px, -1px);
  }
  70% {
    transform: rotate(6deg) translate(1px, 0);
  }
  80% {
    transform: rotate(-4deg) translate(-0.5px, 0.5px);
  }
  90% {
    transform: rotate(2deg) translate(0, -0.5px);
  }
}

@keyframes glow-flash {
  0% {
    opacity: 0;
    transform: scale(0.6);
  }
  25% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.3);
  }
}

.bolt-icon {
  transform-origin: center center;
}

.is-animated .bolt-icon {
  animation: icon-shake 0.15s ease-in-out 3;
}

.track-anim-layer {
  position: absolute;
  inset: -12px;
  border-radius: 9999px;
  background: radial-gradient(
    circle,
    color-mix(in oklch, var(--primary) 45%, transparent) 0%,
    transparent 70%
  );
  pointer-events: none;
  animation: glow-flash 0.5s ease-out forwards;
}
</style>
