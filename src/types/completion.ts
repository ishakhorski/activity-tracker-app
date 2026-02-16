export interface Completion {
  id: string // UUID
  activityId: string // foreign key to Activity
  completedAt: string
  createdAt: string
  updatedAt: string

  // Optional metadata
  note?: string // optional note for this completion
}
