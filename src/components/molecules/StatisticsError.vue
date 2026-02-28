<script setup lang="ts">
import { BaseButton } from '@/components/atoms/button'
import IconChartFill from '@/assets/icons/chart-fill.svg?component'

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full gap-4 pb-16">
    <IconChartFill class="size-16 text-muted-foreground/20" />
    <div class="text-center">
      <p class="text-sm font-medium text-muted-foreground">Something went wrong</p>
      <p class="text-xs text-muted-foreground/60 mt-1">Could not load statistics</p>
    </div>
    <BaseButton variant="secondary" @click="emit('retry')">Retry</BaseButton>
  </div>
</template>
