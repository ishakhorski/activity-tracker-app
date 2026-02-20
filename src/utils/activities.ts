import type { Activity } from '@/types/activity'
import { ACTIVITY_SCHEDULE_TYPE, type Weekday } from '@/types/activitySchedule'

export function isScheduledOnDay(activity: Activity, dayOfWeek: number): boolean {
  const schedule = activity.schedule
  if (schedule.type === ACTIVITY_SCHEDULE_TYPE.WEEKLY) {
    return schedule.days.includes(dayOfWeek as Weekday)
  }
  return true
}

export function isScheduledToday(activity: Activity): boolean {
  return isScheduledOnDay(activity, new Date().getDay())
}

export function getTargetForDay(activity: Activity, dayOfWeek: number): number {
  const schedule = activity.schedule
  if (schedule.type === ACTIVITY_SCHEDULE_TYPE.WEEKLY) {
    return schedule.days.includes(dayOfWeek as Weekday) ? schedule.targetCompletions : 0
  }
  return schedule.targetCompletions
}
