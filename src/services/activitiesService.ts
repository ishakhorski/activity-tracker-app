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

export const createActivity = (data: CreateActivity): Promise<string> => {
  return http.post<string>('/activities', data)
}

export const updateActivity = (id: string, data: UpdateActivity): Promise<string> => {
  return http.patch<string>(`/activities/${id}`, data)
}

export const deleteActivity = (id: string): Promise<void> => {
  return http.delete(`/activities/${id}`)
}
