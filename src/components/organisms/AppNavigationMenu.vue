<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import IconHeart from '@/assets/icons/heart.svg'
import IconChart from '@/assets/icons/chart.svg'

const route = useRoute()

const items = [
  { to: '/activities', label: 'Activities', icon: IconHeart },
  { to: '/stats', label: 'Stats', icon: IconChart },
]

const activeIndex = computed(() => {
  const index = items.findIndex((item) => route.path.startsWith(item.to))
  return index === -1 ? 0 : index
})
</script>

<template>
  <nav aria-label="Main navigation" class="glass rounded-full p-1">
    <div class="relative flex">
      <div
        class="absolute inset-y-0 w-20 rounded-full bg-primary/15 glass transition-transform duration-300 ease-out"
        :style="{ transform: `translateX(${activeIndex * 100}%)` }"
      />

      <RouterLink
        v-for="(item, index) in items"
        :key="item.to"
        :to="item.to"
        class="relative z-10 w-20 h-14 flex flex-col items-center justify-center rounded-full text-xs font-medium transition-colors duration-150"
        :class="activeIndex === index ? 'text-primary' : ''"
      >
        <component
          :is="item.icon"
          class="size-6"
          :class="{ 'heart-active': item.to === '/activities' && activeIndex === index }"
        />
        {{ item.label }}
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.heart-active :deep(path:last-child) {
  fill: var(--destructive);
}
</style>
