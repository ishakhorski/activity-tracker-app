import { useMutation, useQueryClient } from '@tanstack/vue-query'

import type { Completion } from '@/types/completion'
import { deleteCompletion } from '@/services/completionsService'
import { COMPLETIONS_QUERY_KEY } from '@/composables/queries/useCompletionsQuery'

export const useCompletionDeleteMutation = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: (completionId: string) => deleteCompletion(completionId),
    onMutate: async (completionId) => {
      await queryClient.cancelQueries({ queryKey: COMPLETIONS_QUERY_KEY })

      queryClient.setQueriesData<Completion[]>({ queryKey: COMPLETIONS_QUERY_KEY }, (old) =>
        (old ?? []).filter((c) => c.id !== completionId),
      )
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: COMPLETIONS_QUERY_KEY })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COMPLETIONS_QUERY_KEY })
    },
  })

  return { removeCompletion: (completionId: string) => mutate(completionId) }
}
