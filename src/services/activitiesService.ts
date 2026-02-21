import { http } from './http'

import type { Activity, CreateActivity, UpdateActivity } from '@/types/activity'

export const getAllActivities = (
  pagination: { limit?: number; offset?: number } = {},
): Promise<{ data: Activity[]; total: number }> => {
  const { limit = 100, offset = 0 } = pagination
  const params: Record<string, string> = {
    limit: String(limit),
    offset: String(offset),
  }
  return http.get<{ data: Activity[]; total: number }>('/activities', { params })
}

export const getActivityById = (id: string): Promise<Activity> => {
  return http.get<Activity>(`/activities/${id}`)
}

export const createActivity = (data: CreateActivity): Promise<Activity> => {
  return http.post<Activity>('/activities', data)
}

export const updateActivity = (id: string, data: UpdateActivity): Promise<Activity> => {
  return http.patch<Activity>(`/activities/${id}`, data)
}

export const archiveActivity = (id: string): Promise<Activity> => {
  return http.post<Activity>(`/activities/${id}/archive`)
}

export const unarchiveActivity = (id: string): Promise<Activity> => {
  return http.post<Activity>(`/activities/${id}/unarchive`)
}

export const deleteActivity = (id: string): Promise<void> => {
  return http.delete<void>(`/activities/${id}`)
}
