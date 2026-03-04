<script setup lang="ts">
import { BaseButton } from '@/components/atoms/button'

defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="glass rounded-2xl px-4 py-3 flex items-center justify-between gap-4">
    <div class="flex flex-col justify-center h-13.5">
      <p class="text-sm font-medium text-muted-foreground">Completion rate unavailable</p>
      <p class="text-xs text-muted-foreground/60 mt-0.5">Failed to load data</p>
    </div>
    <BaseButton variant="secondary" size="small" @click="$emit('retry')">Retry</BaseButton>
  </div>
</template>
