import { type ActivitySchedule } from './activitySchedule'
import { type ActivityType } from './activityType'

export interface Activity {
  id: string
  title: string
  description?: string
  type: ActivityType
  userId: string
  schedule: ActivitySchedule
  createdAt: string
  updatedAt: string
  archivedAt?: string
}

export type CreateActivity = Omit<
  Activity,
  'id' | 'userId' | 'createdAt' | 'updatedAt' | 'archivedAt'
>

export type UpdateActivity = Partial<
  Omit<Activity, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'archivedAt'>
>
