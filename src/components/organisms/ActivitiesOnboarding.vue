<script setup lang="ts">
import { BaseButton } from '@/components/atoms/button'
import IconPlus from '@/assets/icons/plus.svg?component'
import IconCloudBoltFill from '@/assets/icons/cloud-bolt-fill.svg?component'

const emit = defineEmits<{
  create: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full gap-4 pb-16">
    <IconCloudBoltFill class="size-16 text-muted-foreground/20 animate-empty-bounce" />
    <div class="text-center">
      <p class="text-sm font-medium text-muted-foreground">No activities yet</p>
      <p class="text-xs text-muted-foreground/60 mt-1">Start tracking your first activity</p>
    </div>
    <BaseButton variant="primary" size="medium" class="animate-empty-pulse" @click="emit('create')">
      <IconPlus class="size-4" />
      <span class="sr-only">Add Activity</span>
    </BaseButton>
  </div>
</template>

<style scoped>
@keyframes empty-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes empty-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-empty-bounce {
  animation: empty-bounce 3s ease-in-out infinite;
}

.animate-empty-pulse {
  animation: empty-pulse 2s ease-in-out infinite;
}
</style>
