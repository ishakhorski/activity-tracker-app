import { http } from './http'

import type { Completion, CreateCompletion } from '@/types/completion'

export const getCompletionsByDateRange = (
  from: string,
  to: string,
): Promise<{ data: Completion[]; total: number }> => {
  const params: Record<string, string> = {
    from,
    to,
  }
  return http.get<{ data: Completion[]; total: number }>('/completions', { params })
}

export const createCompletion = (data: CreateCompletion): Promise<string> => {
  return http.post<string>('/completions', data)
}

export const deleteCompletion = (id: string): Promise<void> => {
  return http.delete(`/completions/${id}`)
}
