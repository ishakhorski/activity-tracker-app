<template>
  <div class="flex flex-col gap-3">
    <div v-for="i in count" :key="i" class="glass rounded-2xl px-3 py-4 flex items-center gap-3">
      <div class="flex-1 min-w-0">
        <div class="skeleton h-4 w-28 rounded-md" />
        <div class="flex items-end gap-1 mt-3">
          <div v-for="j in 7" :key="j" class="flex flex-col items-center gap-1">
            <div class="skeleton h-2.5 w-5 rounded" />
            <div class="skeleton w-7 h-7 rounded-md" />
            <div class="skeleton h-2.5 w-4 rounded" />
          </div>
        </div>
      </div>
      <div class="skeleton h-12 w-13.5 rounded-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number;
  }>(),
  { count: 4 },
);
</script>

<style scoped>
@keyframes skeleton-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton {
  background-color: var(--border);
  background-image: linear-gradient(
    90deg,
    transparent 0%,
    oklch(from var(--background) l c h / 0.4) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}
</style>
