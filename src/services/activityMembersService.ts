import { http } from './http'

import type { EnrichedActivityMember, CreateActivityMember } from '@/types/activityMember'

export const getActivityMembers = (
  activityId: string,
  pagination: { limit?: number; offset?: number } = {},
): Promise<{ data: EnrichedActivityMember[]; total: number }> => {
  const { limit = 100, offset = 0 } = pagination
  const params: Record<string, string> = {
    limit: String(limit),
    offset: String(offset),
  }
  return http.get<{ data: EnrichedActivityMember[]; total: number }>(
    `/activities/${activityId}/activity-members`,
    { params },
  )
}

export const createActivityMember = (data: CreateActivityMember): Promise<string> => {
  return http.post<string>('/activity-members', data)
}

export const deleteActivityMember = (id: string): Promise<void> => {
  return http.delete(`/activity-members/${id}`)
}
