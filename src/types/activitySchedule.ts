import type { Weekday } from './weekday'

export const ACTIVITY_SCHEDULE_TYPE = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
} as const

export interface DailySchedule {
  type: typeof ACTIVITY_SCHEDULE_TYPE.DAILY
  targetCompletions: number
}

export interface WeeklySchedule {
  type: typeof ACTIVITY_SCHEDULE_TYPE.WEEKLY
  days: Weekday[]
  targetCompletions: number
}

export type ActivitySchedule = DailySchedule | WeeklySchedule
