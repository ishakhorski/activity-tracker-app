import { type ActivitySchedule } from './activitySchedule'

export interface Activity {
  id: string
  title: string
  description?: string
  schedule: ActivitySchedule
  createdAt: string
  updatedAt: string
  archivedAt?: string
}

export type CreateActivity = Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'archivedAt'>

export type UpdateActivity = Partial<
  Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'archivedAt'>
>
