<script setup lang="ts">
defineProps<{
  description: string | null
}>()
</script>

<template>
  <div class="glass rounded-2xl px-4 py-3 flex flex-col gap-1.5">
    <span class="text-xs text-muted-foreground">Description</span>
    <p v-if="description" class="text-sm">{{ description }}</p>
    <p v-else class="text-sm text-muted-foreground/40 italic">No description</p>
  </div>
</template>
