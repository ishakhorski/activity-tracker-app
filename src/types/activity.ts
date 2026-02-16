import { type ActivitySchedule } from './activitySchedule'

export interface Activity {
  id: string
  title: string
  description?: string
  createdAt: string
  updatedAt: string
  archivedAt?: string

  // Scheduling
  schedule: ActivitySchedule

  // Ordering
  sortOrder: number // for drag-and-drop positioning
}
