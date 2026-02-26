<script setup lang="ts">
import { computed } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'

const brickVariants = cva(
  'brick flex items-center justify-center aspect-square rounded-md overflow-hidden',
  {
    variants: {
      variant: {
        ghost: 'bg-foreground/[0.02] text-muted-foreground/40',
        faint: 'bg-foreground/5 text-muted-foreground/40',
        soft: 'bg-foreground/5 text-primary/75',
        solid: 'bg-foreground/5 text-primary',
        glow: 'bg-foreground/[0.02] text-muted-foreground',
      },
    },
  },
)

type BrickVariants = VariantProps<typeof brickVariants>

const props = defineProps<{
  variant: NonNullable<BrickVariants['variant']>
  percentage?: number
}>()

const fillHeight = computed(() => {
  if (props.variant === 'glow') return '100%'
  if (props.variant === 'solid') return `${props.percentage ?? 100}%`
  if (props.variant === 'soft') return `${props.percentage ?? 0}%`
  return '0%'
})

const fillBg = computed(() => {
  switch (props.variant) {
    case 'soft':
      return 'color-mix(in oklab, var(--color-primary) 12%, transparent)'
    case 'solid':
      return 'color-mix(in oklab, var(--color-primary) 25%, transparent)'
    case 'glow':
      return 'color-mix(in oklab, var(--color-primary) 8%, transparent)'
    default:
      return 'transparent'
  }
})
</script>

<template>
  <div :class="brickVariants({ variant })">
    <slot />
  </div>
</template>

<style scoped>
.brick {
  position: relative;
  transition:
    background-color 0.35s ease,
    color 0.35s ease;
}

.brick::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: v-bind(fillHeight);
  background-color: v-bind(fillBg);
  transition:
    background-color 0.35s ease,
    height 0.35s ease;
}
</style>
