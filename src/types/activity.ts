import { type ActivitySchedule } from './activitySchedule'
import { type ActivityType } from './activityType'
import type { EnrichedCompletion } from './completion'

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

export interface EnrichedActivity extends Activity {
  completionsByDate: Record<string, EnrichedCompletion[]>
}

export type CreateActivity = Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'archivedAt'>

export type UpdateActivity = Partial<Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>>
