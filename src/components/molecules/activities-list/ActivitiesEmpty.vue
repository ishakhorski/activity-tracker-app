<script setup lang="ts">
import IconCloudBoltFill from '@/assets/icons/cloud-bolt-fill.svg?component'
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full gap-4 pb-16">
    <IconCloudBoltFill
      class="size-16 text-muted-foreground/20 motion-safe:animate-[bounce_3s_infinite]"
    />
    <div class="text-center">
      <p class="text-sm font-medium text-muted-foreground">No activities yet</p>
      <p class="text-xs text-muted-foreground/60 mt-1">Start tracking your first activity</p>
    </div>
  </div>
</template>
