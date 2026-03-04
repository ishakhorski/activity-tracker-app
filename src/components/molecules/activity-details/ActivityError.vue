<script setup lang="ts">
import IconCloudBoltFill from '@/assets/icons/cloud-bolt-fill.svg?component'
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full gap-4 py-16">
    <IconCloudBoltFill class="size-16 text-muted-foreground/20" />
    <div class="text-center">
      <p class="text-sm font-medium text-muted-foreground">Activity not found</p>
      <p class="text-xs text-muted-foreground/60 mt-1">It may have been deleted or never existed</p>
    </div>
  </div>
</template>
