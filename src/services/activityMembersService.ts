import { http } from './http'

import type { ActivityMember, CreateActivityMember } from '@/types/activityMember'

export const getActivityMembers = (
  activityId: string,
): Promise<{ data: ActivityMember[]; total: number }> => {
  return http.get<{ data: ActivityMember[]; total: number }>(`/activities/${activityId}/members`)
}

export const createActivityMember = (data: CreateActivityMember): Promise<ActivityMember> => {
  return http.post<ActivityMember>('/activity-members', data)
}

export const deleteActivityMember = (id: string): Promise<void> => {
  return http.delete(`/activity-members/${id}`)
}
