import type { Activity } from '@/types/activity'
import { ACTIVITY_SCHEDULE_TYPE, type Weekday } from '@/types/activitySchedule'

export const isScheduledOnDay = (activity: Activity, dayOfWeek: number): boolean => {
  const schedule = activity.schedule
  if (schedule.type === ACTIVITY_SCHEDULE_TYPE.WEEKLY) {
    return schedule.days.includes(dayOfWeek as Weekday)
  }
  return true
}

export const isScheduledToday = (activity: Activity): boolean =>
  isScheduledOnDay(activity, new Date().getDay())

export const getTargetForDay = (activity: Activity, dayOfWeek: number): number => {
  const schedule = activity.schedule
  if (schedule.type === ACTIVITY_SCHEDULE_TYPE.WEEKLY) {
    return schedule.days.includes(dayOfWeek as Weekday) ? schedule.targetCompletions : 0
  }
  return schedule.targetCompletions
}

export const isTargetMet = (activity: Activity, todayCount: number): boolean => {
  if (!isScheduledToday(activity)) return todayCount > 0
  return todayCount >= activity.schedule.targetCompletions
}
