import { http, type PaginatedResponse, type PaginationParams } from './http'

import type { Activity } from '@/types/activity'
import type { ActivitySchedule } from '@/types/activitySchedule'

export const getAllActivities = (
  pagination: PaginationParams = { limit: 100, offset: 0 },
): Promise<PaginatedResponse<Activity>> => {
  const params: Record<string, string> = {}
  params.limit = String(pagination.limit)
  params.offset = String(pagination.offset)
  return http.get<PaginatedResponse<Activity>>('/activities', { params })
}

export const getActivityById = (id: string): Promise<Activity> => {
  return http.get<Activity>(`/activities/${id}`)
}

export const createActivity = (data: {
  title: string
  schedule: ActivitySchedule
}): Promise<Activity> => {
  return http.post<Activity>('/activities', data)
}

export const updateActivity = (
  id: string,
  data: Partial<Pick<Activity, 'title' | 'schedule'>>,
): Promise<Activity> => {
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
