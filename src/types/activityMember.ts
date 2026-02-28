export const ACTIVITY_MEMBER_ROLE = {
  OWNER: 'owner',
  MEMBER: 'member',
} as const
export type ActivityMemberRole = (typeof ACTIVITY_MEMBER_ROLE)[keyof typeof ACTIVITY_MEMBER_ROLE]

export interface ActivityMember {
  id: string
  activityId: string
  userId: string
  role: ActivityMemberRole
  createdAt: string
  updatedAt: string
}

export interface EnrichedActivityMember extends ActivityMember {
  displayName: string
}

export type CreateActivityMember = Omit<ActivityMember, 'id' | 'createdAt' | 'updatedAt'>
