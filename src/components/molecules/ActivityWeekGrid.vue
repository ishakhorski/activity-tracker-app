<script setup lang="ts">
import { computed } from 'vue'

import IconBolt from '@/assets/icons/bolt.svg?component'
import IconBoltFill from '@/assets/icons/bolt-fill.svg?component'

import ActivityBrick from '@/components/molecules/ActivityBrick.vue'

import { useDaysGrid } from '@/composables/useDaysGrid'
import { DAY_STATUS_BRICK_VARIANT, getDayStatus, getTargetForDay } from '@/utils/activities'
import type { DayStatus } from '@/utils/activities'

import type { ActivitySchedule, Weekday } from '@/types/activitySchedule'
import type { Completion } from '@/types/completion'

const props = defineProps<{
  schedule: ActivitySchedule
  completionsByDate: Record<string, Completion[]>
  from: string
  to: string
}>()

const { daysGrid } = useDaysGrid({
  from: () => props.from,
  to: () => props.to,
})

const isScheduledDay = (weekday: number) => {
  const schedule = props.schedule
  return schedule.type === 'daily' || schedule.days.includes(weekday as Weekday)
}

const daysGridData = computed(() => {
  const record: Record<string, { status: DayStatus; percentage: number | undefined }> = {}

  for (const item of daysGrid.value) {
    const count = props.completionsByDate[item.dateKey]?.length ?? 0
    const target = getTargetForDay(props.schedule, item.weekday)
    record[item.dateKey] = {
      status: getDayStatus(count, target),
      percentage: target > 0 ? Math.min((count / target) * 100, 100) : undefined,
    }
  }

  return record
})
</script>

<template>
  <div class="flex items-end gap-1">
    <div v-for="day in daysGrid" :key="day.dateKey" class="flex flex-col items-center gap-1">
      <span
        class="text-[10px] leading-none"
        :class="
          day.position === 'today'
            ? 'text-primary font-semibold'
            : isScheduledDay(day.weekday)
              ? 'text-foreground font-medium'
              : 'text-muted-foreground/40'
        "
      >
        {{ day.weekdayLabel }}
      </span>

      <ActivityBrick
        :variant="DAY_STATUS_BRICK_VARIANT[daysGridData[day.dateKey]!.status]"
        :percentage="daysGridData[day.dateKey]!.percentage"
        class="w-7 h-7"
      >
        <IconBoltFill
          v-if="daysGridData[day.dateKey]!.status === 'completed'"
          class="h-3 w-auto relative z-1"
          aria-hidden="true"
        />
        <IconBolt
          v-else-if="daysGridData[day.dateKey]!.status === 'uncompleted'"
          class="h-3 w-auto relative z-1"
          aria-hidden="true"
        />
      </ActivityBrick>

      <span
        class="text-[10px] leading-none tabular-nums"
        :class="
          day.position === 'today' ? 'text-primary font-semibold' : 'text-muted-foreground/60'
        "
      >
        {{ day.dayNumber }}
      </span>
    </div>
  </div>
</template>
