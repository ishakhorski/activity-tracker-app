import { http, type PaginatedResponse, type PaginationParams } from './http'

import type { Completion } from '@/types/completion'

export const getCompletionsByDateRange = (
  from: string,
  to: string,
  pagination: PaginationParams = { limit: 100, offset: 0 },
): Promise<PaginatedResponse<Completion>> => {
  const params: Record<string, string> = {
    from,
    to,
    limit: String(pagination.limit),
    offset: String(pagination.offset),
  }
  return http.get<PaginatedResponse<Completion>>('/completions', { params })
}

export const createCompletion = (activityId: string, date: string): Promise<Completion> => {
  return http.post<Completion>('/completions', { activityId, completedAt: date })
}

export const deleteCompletion = (id: string): Promise<void> => {
  return http.delete<void>(`/completions/${id}`)
}
