export const ACTIVITY_TYPE = {
  PERSONAL: 'personal',
  GROUP: 'group',
  SHARED: 'shared',
} as const

export type ActivityType = (typeof ACTIVITY_TYPE)[keyof typeof ACTIVITY_TYPE]
