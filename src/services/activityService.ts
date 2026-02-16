import type { Activity } from '@/types/activity'
import type { ActivitySchedule } from '@/types/activitySchedule'
import * as storage from './storage'

const STORAGE_KEY = 'activities'

export const getAllActivities = (): Activity[] => {
  return storage.getAll<Activity>(STORAGE_KEY)
}

export const getActivityById = (id: string): Activity | null => {
  return storage.getById<Activity>(STORAGE_KEY, id)
}

export const createActivity = (data: { title: string; schedule: ActivitySchedule }): Activity => {
  const now = new Date().toISOString()
  const all = storage.getAll<Activity>(STORAGE_KEY)
  const activity: Activity = {
    id: crypto.randomUUID(),
    title: data.title,
    createdAt: now,
    updatedAt: now,
    schedule: data.schedule,
    sortOrder: all.length,
  }
  return storage.create<Activity>(STORAGE_KEY, activity)
}

export const updateActivity = (
  id: string,
  data: Partial<Pick<Activity, 'title' | 'schedule'>>,
): Activity | null => {
  return storage.update<Activity>(STORAGE_KEY, id, {
    ...data,
    updatedAt: new Date().toISOString(),
  })
}

export const archiveActivity = (id: string): Activity | null => {
  return storage.update<Activity>(STORAGE_KEY, id, {
    archivedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

export const unarchiveActivity = (id: string): Activity | null => {
  return storage.update<Activity>(STORAGE_KEY, id, {
    archivedAt: undefined,
    updatedAt: new Date().toISOString(),
  })
}

export const deleteActivity = (id: string): boolean => {
  return storage.remove<Activity>(STORAGE_KEY, id)
}
