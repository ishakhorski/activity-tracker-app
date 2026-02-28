import { http } from './http'

import type { EnrichedCompletion, CreateCompletion } from '@/types/completion'

export const getCompletionsByDateRange = (
  dateFrom: string,
  dateTo: string,
): Promise<{ data: EnrichedCompletion[]; total: number }> => {
  const params: Record<string, string> = {
    from: dateFrom,
    to: dateTo,
  }
  return http.get<{ data: EnrichedCompletion[]; total: number }>('/completions', { params })
}

export const createCompletion = (data: CreateCompletion): Promise<string> => {
  return http.post<string>('/completions', data)
}

export const deleteCompletion = (id: string): Promise<void> => {
  return http.delete(`/completions/${id}`)
}
