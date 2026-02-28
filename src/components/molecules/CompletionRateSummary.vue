<script setup lang="ts">
import { computed } from 'vue'

import type { CompletionRateStatistic } from '@/types/statistics'

const props = defineProps<{
  summary: CompletionRateStatistic['summary']
}>()

const ratePercent = computed(() => Math.round(props.summary.rate * 100))
</script>

<template>
  <div class="glass rounded-2xl px-4 py-3 grid grid-cols-3">
    <div class="flex flex-col gap-0.5 pr-4 border-r border-border">
      <span class="text-xs text-muted-foreground">Completion rate</span>
      <span class="text-3xl font-bold tracking-tight">{{ ratePercent }}%</span>
    </div>
    <div class="flex flex-col gap-0.5 px-4">
      <span class="text-xs text-muted-foreground">Completed</span>
      <span class="text-xl font-semibold">{{ summary.completed }}</span>
    </div>
    <div class="flex flex-col gap-0.5 pl-4">
      <span class="text-xs text-muted-foreground">Scheduled</span>
      <span class="text-xl font-semibold">{{ summary.scheduled }}</span>
    </div>
  </div>
</template>
