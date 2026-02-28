import { format } from 'date-fns'

import type { Activity, EnrichedActivity } from '@/types/activity'
import type { CompletionWithUser } from '@/types/completion'
import {
  ACTIVITY_SCHEDULE_TYPE,
  type ActivitySchedule,
  type Weekday,
} from '@/types/activitySchedule'

export const toLocalDateKey = (date: Date): string => format(date, 'yyyy-MM-dd')

export const enrichActivity = (
  activity: Activity,
  completions: CompletionWithUser[],
): EnrichedActivity => {
  const completionsByDate: Record<string, CompletionWithUser[]> = {}
  for (const completion of completions) {
    if (completion.activityId !== activity.id) continue
    const key = toLocalDateKey(new Date(completion.completedAt))
    ;(completionsByDate[key] ??= []).push(completion)
  }
  return { ...activity, completionsByDate }
}

export const isScheduledOnDay = (activity: Activity, dayOfWeek: number): boolean => {
  const schedule = activity.schedule
  if (schedule.type === ACTIVITY_SCHEDULE_TYPE.WEEKLY) {
    return schedule.days.includes(dayOfWeek as Weekday)
  }
  return true
}

export const isScheduledToday = (activity: Activity): boolean =>
  isScheduledOnDay(activity, new Date().getDay())

export const getTargetForDay = (schedule: ActivitySchedule, dayOfWeek: number): number => {
  if (schedule.type === ACTIVITY_SCHEDULE_TYPE.WEEKLY) {
    return schedule.days.includes(dayOfWeek as Weekday) ? schedule.targetCompletions : 0
  }
  return schedule.targetCompletions
}

export const isTargetMet = (activity: Activity, todayCount: number): boolean => {
  if (!isScheduledToday(activity)) return todayCount > 0
  return todayCount >= activity.schedule.targetCompletions
}

export type DayStatus = 'completed' | 'partial' | 'uncompleted' | 'none'

export const getDayStatus = (count: number, target: number): DayStatus => {
  if (count > 0 && (target === 0 || count >= target)) return 'completed'
  if (count > 0) return 'partial'
  if (target > 0) return 'uncompleted'
  return 'none'
}

export const DAY_STATUS_BRICK_VARIANT: Record<DayStatus, 'solid' | 'soft' | 'faint' | 'ghost'> = {
  completed: 'solid',
  partial: 'soft',
  uncompleted: 'faint',
  none: 'ghost',
}
