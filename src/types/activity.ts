import { type ActivitySchedule } from './activitySchedule'
import { type ActivityType } from './activityType'
import type { CompletionWithUser } from './completion'

export interface EnrichedActivity extends Activity {
  completionsByDate: Record<string, CompletionWithUser[]>
}

export interface Activity {
  id: string
  title: string
  description: string | null
  type: ActivityType
  schedule: ActivitySchedule
  createdAt: string
  updatedAt: string
  archivedAt: string | null
}

export type CreateActivity = Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'archivedAt'>

export type UpdateActivity = Partial<Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>>
