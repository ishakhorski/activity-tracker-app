<script setup lang="ts">
import { computed } from 'vue'

import IconBolt from '@/assets/icons/bolt.svg?component'
import IconBoltFill from '@/assets/icons/bolt-fill.svg?component'

import ActivityBrick from '@/components/molecules/ActivityBrick.vue'

import {
  DAY_STATUS_BRICK_VARIANT,
  getDayStatus,
  getTargetForDay,
  toLocalDateKey,
} from '@/utils/activities'
import type { DayPosition } from '@/utils/activities'

import type { ActivitySchedule } from '@/types/activitySchedule'
import type { Completion } from '@/types/completion'

const props = defineProps<{
  schedule: ActivitySchedule
  completionsByDate: Record<string, Completion[]>
  from: string
}>()

const todayKey = toLocalDateKey(new Date())

const parsedFrom = computed(() => {
  const date = new Date(`${props.from}T00:00:00`)
  return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() }
})

const days = computed(() =>
  Array.from({ length: 7 }, (_, i) => {
    const dayStart = new Date(
      parsedFrom.value.year,
      parsedFrom.value.month,
      parsedFrom.value.day + i,
    )
    const dateKey = toLocalDateKey(dayStart)
    const position: DayPosition =
      dateKey === todayKey ? 'today' : dateKey > todayKey ? 'future' : 'past'
    return {
      day: dayStart.getDate(),
      dateKey,
      position,
      weekday: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
    }
  }),
)

const dayData = computed(() => {
  const record: Record<
    string,
    { dayStatus: ReturnType<typeof getDayStatus>; percentage: number | undefined }
  > = {}
  for (let i = 0; i < 7; i++) {
    const dayStart = new Date(
      parsedFrom.value.year,
      parsedFrom.value.month,
      parsedFrom.value.day + i,
    )
    const dateKey = toLocalDateKey(dayStart)
    const count = props.completionsByDate[dateKey]?.length ?? 0
    const target = getTargetForDay(props.schedule, dayStart.getDay())
    record[dateKey] = {
      dayStatus: getDayStatus(count, target),
      percentage: target > 0 ? Math.min((count / target) * 100, 100) : undefined,
    }
  }
  return record
})
</script>

<template>
  <div class="flex items-end gap-1">
    <div v-for="day in days" :key="day.dateKey" class="flex flex-col items-center gap-1">
      <span
        class="text-[10px] leading-none"
        :class="day.position === 'today' ? 'text-primary font-semibold' : 'text-muted-foreground'"
      >
        {{ day.weekday }}
      </span>

      <ActivityBrick
        :variant="DAY_STATUS_BRICK_VARIANT[dayData[day.dateKey].dayStatus]"
        :percentage="dayData[day.dateKey].percentage"
        class="w-7 h-7"
      >
        <IconBoltFill
          v-if="dayData[day.dateKey].dayStatus === 'completed'"
          class="h-3 w-auto relative z-1"
          aria-hidden="true"
        />
        <IconBolt
          v-else-if="dayData[day.dateKey].dayStatus === 'uncompleted'"
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
        {{ day.day }}
      </span>
    </div>
  </div>
</template>
