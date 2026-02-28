<script setup lang="ts">
import { computed } from 'vue'
import { endOfMonth, format, getISODay, parse } from 'date-fns'

import ActivityBrick from '@/components/molecules/ActivityBrick.vue'

import { useDaysGrid } from '@/composables/useDaysGrid'
import { DAY_STATUS_BRICK_VARIANT, getDayStatus, getTargetForDay } from '@/utils/activities'
import type { DayStatus } from '@/utils/activities'

import type { ActivitySchedule } from '@/types/activitySchedule'
import type { Weekday } from '@/types/weekday'
import type { EnrichedCompletion } from '@/types/completion'

const props = defineProps<{
  schedule: ActivitySchedule
  completionsByDate: Record<string, EnrichedCompletion[]>
  from: string
  loading: boolean
}>()

const emit = defineEmits<{
  click: [date: string]
}>()

const weekHeaders = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const headerWeekdays = [1, 2, 3, 4, 5, 6, 0]

const isScheduledHeaderDay = (headerIndex: number) => {
  const weekday = headerWeekdays[headerIndex] ?? 0
  const schedule = props.schedule
  return schedule.type === 'daily' || schedule.days.includes(weekday as Weekday)
}

const fromDate = computed(() => parse(props.from, 'yyyy-MM-dd', new Date()))
const to = computed(() => format(endOfMonth(fromDate.value), 'yyyy-MM-dd'))
const firstDayOffset = computed(() => getISODay(fromDate.value) - 1)

const { daysGrid } = useDaysGrid({
  from: () => props.from,
  to: () => to.value,
})

const daysGridData = computed(() => {
  const record: Record<
    string,
    { status: DayStatus; percentage: number | undefined; memberCount: number }
  > = {}

  for (const item of daysGrid.value) {
    const completions = props.completionsByDate[item.dateKey] ?? []
    const count = completions.length
    const target = getTargetForDay(props.schedule, item.weekday)
    const memberCount = new Set(completions.map((c) => c.userId)).size
    record[item.dateKey] = {
      status: getDayStatus(count, target),
      percentage: target > 0 ? Math.min((count / target) * 100, 100) : undefined,
      memberCount,
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
        class="text-center text-[10px] leading-none"
        :class="
          isScheduledHeaderDay(i) ? 'text-foreground font-medium' : 'text-muted-foreground/40'
        "
      >
        {{ label }}
      </span>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <div v-for="i in firstDayOffset" :key="`offset-${i}`" class="aspect-square" />

      <button
        v-for="day in daysGrid"
        :key="day.dateKey"
        :disabled="day.position === 'future' || loading"
        class="relative transition-transform ease-in duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        :class="
          day.position === 'future' || loading ? 'cursor-default' : 'cursor-pointer active:scale-90'
        "
        @click="emit('click', day.dateKey)"
      >
        <ActivityBrick
          :variant="DAY_STATUS_BRICK_VARIANT[daysGridData[day.dateKey]!.status]"
          :percentage="daysGridData[day.dateKey]!.percentage"
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
            {{ day.dayNumber }}
          </span>
        </ActivityBrick>

        <span
          v-if="daysGridData[day.dateKey]!.memberCount > 0 && day.position !== 'future' && !loading"
          class="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[6px] rounded-full min-w-3 h-3 flex items-center justify-center px-0.5 font-semibold leading-none pointer-events-none"
        >
          {{ daysGridData[day.dateKey]!.memberCount }}
        </span>
      </button>
    </div>
  </div>
</template>
