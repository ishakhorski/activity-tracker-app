import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getCompletionsByDateRange } from '@/services/completionsService'

export const COMPLETIONS_QUERY_KEY = ['completions'] as const

export const useCompletionsQuery = (from: Ref<string>, to: Ref<string>) => {
  return useQuery({
    queryKey: computed(() => [...COMPLETIONS_QUERY_KEY, from.value, to.value]),
    queryFn: async () => {
      const response = await getCompletionsByDateRange(from.value, to.value)
      return response.data
    },
  })
}
