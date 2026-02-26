<script setup lang="ts">
import { computed } from 'vue'

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
  loading: boolean
}>()

const emit = defineEmits<{
  click: [date: string]
}>()

const weekHeaders = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

const todayKey = toLocalDateKey(new Date())

const parsedFrom = computed(() => {
  const date = new Date(`${props.from}T00:00:00`)
  return { year: date.getFullYear(), month: date.getMonth() }
})

const firstDayOffset = computed(
  () => (new Date(parsedFrom.value.year, parsedFrom.value.month, 1).getDay() + 6) % 7,
)

const daysInMonth = computed(() =>
  new Date(parsedFrom.value.year, parsedFrom.value.month + 1, 0).getDate(),
)

const days = computed(() =>
  Array.from({ length: daysInMonth.value }, (_, i) => {
    const day = i + 1
    const dateKey = toLocalDateKey(new Date(parsedFrom.value.year, parsedFrom.value.month, day))
    const position: DayPosition =
      dateKey === todayKey ? 'today' : dateKey > todayKey ? 'future' : 'past'
    return { day, dateKey, position }
  }),
)

const dayData = computed(() => {
  const record: Record<
    string,
    { dayStatus: ReturnType<typeof getDayStatus>; percentage: number | undefined }
  > = {}
  for (let i = 0; i < daysInMonth.value; i++) {
    const dayStart = new Date(parsedFrom.value.year, parsedFrom.value.month, i + 1)
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
  <div class="flex flex-col gap-1">
    <div class="grid grid-cols-7 gap-1">
      <span
        v-for="(label, i) in weekHeaders"
        :key="i"
        class="text-center text-[10px] text-muted-foreground leading-none"
      >
        {{ label }}
      </span>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <div v-for="i in firstDayOffset" :key="`offset-${i}`" class="aspect-square" />

      <button
        v-for="day in days"
        :key="day.day"
        :disabled="day.position === 'future' || loading"
        class="transition-transform ease-in duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        :class="
          day.position === 'future' || loading ? 'cursor-default' : 'cursor-pointer active:scale-90'
        "
        @click="emit('click', day.dateKey)"
      >
        <ActivityBrick
          :variant="DAY_STATUS_BRICK_VARIANT[dayData[day.dateKey].dayStatus]"
          :percentage="dayData[day.dateKey].percentage"
          :class="[
            day.position === 'today' ? 'ring-1 ring-inset ring-primary/50' : '',
            day.position === 'future' ? 'opacity-30' : '',
            loading ? 'animate-pulse' : '',
          ]"
        >
          <span
            class="relative z-1 text-[9px] leading-none"
            :class="day.position === 'today' ? 'font-bold' : ''"
          >
            {{ day.day }}
          </span>
        </ActivityBrick>
      </button>
    </div>
  </div>
</template>
