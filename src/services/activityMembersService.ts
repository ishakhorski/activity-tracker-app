import { http } from './http'

import type {
  ActivityMember,
  CreateActivityMember,
  UpdateActivityMember,
} from '@/types/activityMember'

export const getActivityMembers = (
  activityId: string,
  pagination: { limit?: number; offset?: number } = {},
): Promise<{ data: ActivityMember[]; total: number }> => {
  const { limit = 100, offset = 0 } = pagination
  const params: Record<string, string> = {
    activityId,
    limit: String(limit),
    offset: String(offset),
  }
  return http.get<{ data: ActivityMember[]; total: number }>('/activity-members', { params })
}

export const getActivityMemberById = (id: string): Promise<ActivityMember> => {
  return http.get<ActivityMember>(`/activity-members/${id}`)
}

export const createActivityMember = (data: CreateActivityMember): Promise<ActivityMember> => {
  return http.post<ActivityMember>('/activity-members', data)
}

export const updateActivityMember = (
  id: string,
  data: UpdateActivityMember,
): Promise<ActivityMember> => {
  return http.patch<ActivityMember>(`/activity-members/${id}`, data)
}

export const deleteActivityMember = (id: string): Promise<void> => {
  return http.delete<void>(`/activity-members/${id}`)
}
