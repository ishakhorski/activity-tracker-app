import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getCompletionsByDateRange } from '@/services/completionsService'

export const COMPLETIONS_QUERY_KEY = 'completions' as const

export const useCompletionsQuery = (
  dateFrom: MaybeRefOrGetter<string>,
  dateTo: MaybeRefOrGetter<string>,
) => {
  return useQuery({
    queryKey: computed(() => [COMPLETIONS_QUERY_KEY, toValue(dateFrom), toValue(dateTo)]),
    queryFn: async () => {
      const response = await getCompletionsByDateRange(toValue(dateFrom), toValue(dateTo))
      return response.data
    },
  })
}
