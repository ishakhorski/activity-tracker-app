<script setup lang="ts">
import { computed } from 'vue'

import type { ThroughputStatistic } from '@/types/statistics'

const props = defineProps<{
  summary: ThroughputStatistic['summary']
}>()

const averageDisplay = computed(() => {
  const avg = props.summary.average
  return Number.isInteger(avg) ? String(avg) : avg.toFixed(1)
})
</script>

<template>
  <div class="glass rounded-2xl px-4 py-3 grid grid-cols-2">
    <div class="flex flex-col gap-0.5 pr-4 border-r border-border">
      <span class="text-xs text-muted-foreground">Total completions</span>
      <span class="text-3xl font-bold tracking-tight">{{ summary.total }}</span>
    </div>
    <div class="flex flex-col gap-0.5 pl-4">
      <span class="text-xs text-muted-foreground">Daily average</span>
      <span class="text-xl font-semibold"
        >{{ averageDisplay
        }}<span class="text-sm font-normal text-muted-foreground">/day</span></span
      >
    </div>
  </div>
</template>
