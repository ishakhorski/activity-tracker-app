import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { eachDayOfInterval, format, getDay, parse } from 'date-fns'

import type { DayPosition, DaysGrid } from '@/types/daysGrid'

const todayKey = format(new Date(), 'yyyy-MM-dd')

export const useDaysGrid = (options: {
  from: MaybeRefOrGetter<string>
  to: MaybeRefOrGetter<string>
}) => {
  const daysGrid = computed((): DaysGrid => {
    const fromDate = parse(toValue(options.from), 'yyyy-MM-dd', new Date())
    const toDate = parse(toValue(options.to), 'yyyy-MM-dd', new Date())

    return eachDayOfInterval({ start: fromDate, end: toDate }).map((date) => {
      const dateKey = format(date, 'yyyy-MM-dd')
      const position: DayPosition =
        dateKey === todayKey ? 'today' : dateKey > todayKey ? 'future' : 'past'

      return {
        dateKey,
        dayNumber: date.getDate(),
        weekday: getDay(date),
        weekdayLabel: format(date, 'EEE'),
        position,
      }
    })
  })

  return { daysGrid }
}
