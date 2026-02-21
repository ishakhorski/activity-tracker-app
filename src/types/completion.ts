export interface Completion {
  id: string
  activityId: string
  userId: string
  completedAt: string
  note?: string
  createdAt: string
  updatedAt: string
}

export type CreateCompletion = Omit<Completion, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
