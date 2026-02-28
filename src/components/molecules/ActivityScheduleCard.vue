<script setup lang="ts">
import { computed } from 'vue'

import { ACTIVITY_SCHEDULE_TYPE, type ActivitySchedule } from '@/types/activitySchedule'
import { WEEKDAY_LABELS, WEEKDAYS_ORDERED } from '@/types/weekday'

const props = defineProps<{
  schedule: ActivitySchedule
}>()

const typeLabel = computed(() =>
  props.schedule.type === ACTIVITY_SCHEDULE_TYPE.DAILY ? 'Daily' : 'Weekly',
)

const detailLabel = computed(() => {
  const schedule = props.schedule
  if (schedule.type === ACTIVITY_SCHEDULE_TYPE.DAILY) {
    return `${schedule.targetCompletions}× per day`
  }
  const days = WEEKDAYS_ORDERED.filter((d) => schedule.days.includes(d))
    .map((d) => WEEKDAY_LABELS[d])
    .join(', ')
  return `${days} · ${schedule.targetCompletions}× per session`
})
</script>

<template>
  <div class="glass rounded-2xl px-4 py-3 flex items-center justify-between gap-4">
    <span class="text-xs text-muted-foreground shrink-0">Schedule</span>
    <span class="text-sm font-medium text-right truncate min-w-0">
      {{ typeLabel }} · {{ detailLabel }}
    </span>
  </div>
</template>
