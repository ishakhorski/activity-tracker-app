import { http } from './http'

import type { Completion, CreateCompletion } from '@/types/completion'

export const getCompletionsByDateRange = (
  from: string,
  to: string,
  pagination: { limit?: number; offset?: number } = {},
): Promise<{ data: Completion[]; total: number }> => {
  const { limit = 100, offset = 0 } = pagination
  const params: Record<string, string> = {
    from,
    to,
    limit: String(limit),
    offset: String(offset),
  }
  return http.get<{ data: Completion[]; total: number }>('/completions', { params })
}

export const createCompletion = (data: CreateCompletion): Promise<Completion> => {
  return http.post<Completion>('/completions', data)
}

export const deleteCompletion = (id: string): Promise<void> => {
  return http.delete<void>(`/completions/${id}`)
}
