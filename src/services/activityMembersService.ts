import { http } from './http'

import type {
  ActivityMember,
  ActivityMemberWithUser,
  CreateActivityMember,
} from '@/types/activityMember'

export const getActivityMembers = (
  activityId: string,
): Promise<{ data: ActivityMemberWithUser[]; total: number }> => {
  return http.get<{ data: ActivityMemberWithUser[]; total: number }>(
    `/activities/${activityId}/members`,
  )
}

export const createActivityMember = (data: CreateActivityMember): Promise<ActivityMember> => {
  return http.post<ActivityMember>('/activity-members', data)
}

export const deleteActivityMember = (id: string): Promise<void> => {
  return http.delete(`/activity-members/${id}`)
}
