export interface Completion {
  id: string
  activityId: string
  userId: string
  completedAt: string
  note: string | null
  createdAt: string
  updatedAt: string
}

export interface CompletionWithUser extends Completion {
  displayName: string
}

export type CreateCompletion = Omit<Completion, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
