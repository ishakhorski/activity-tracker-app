<script setup lang="ts">
import IconCloudBoltFill from '@/assets/icons/cloud-bolt-fill.svg?component'
import { BaseButton } from '@/components/atoms/button'

defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full gap-4 py-16">
    <IconCloudBoltFill class="size-16 text-muted-foreground/20" />
    <div class="text-center">
      <p class="text-sm font-medium text-muted-foreground">Failed to load archive</p>
      <p class="text-xs text-muted-foreground/60 mt-1">Something went wrong. Try again later.</p>
    </div>
    <BaseButton variant="secondary" size="small" @click="$emit('retry')">Try again</BaseButton>
  </div>
</template>
