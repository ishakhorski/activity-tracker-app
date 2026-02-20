<script setup lang="ts">
import { BaseButton } from '@/components/atoms/button'
import IconCloudSunRainFill from '@/assets/icons/cloud-sun-rain-fill.svg'

const emit = defineEmits<{
  clearFilters: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full gap-3 pb-16">
    <IconCloudSunRainFill class="size-16 text-muted-foreground/20 animate-empty-bounce" />
    <p class="text-sm text-muted-foreground">No activities match current filters</p>
    <BaseButton variant="secondary" size="small" @click="emit('clearFilters')">
      Clear filters
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

.animate-empty-bounce {
  animation: empty-bounce 3s ease-in-out infinite;
}
</style>
