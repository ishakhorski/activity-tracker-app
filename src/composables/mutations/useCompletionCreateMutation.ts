import { useMutation, useQueryClient } from '@tanstack/vue-query'

import type { Completion, CreateCompletion } from '@/types/completion'
import { createCompletion } from '@/services/completionsService'
import { useAuth } from '@/composables/useAuth'
import { COMPLETIONS_QUERY_KEY } from '@/composables/queries/useCompletionsQuery'

export const useCompletionCreateMutation = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { mutate } = useMutation({
    mutationFn: (data: CreateCompletion) => createCompletion(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: COMPLETIONS_QUERY_KEY })

      const now = new Date().toISOString()
      const tempId = `temp-${crypto.randomUUID()}`
      const optimistic: Completion = {
        id: tempId,
        activityId: data.activityId,
        userId: user.value?.id ?? '',
        completedAt: data.completedAt,
        note: data.note,
        createdAt: now,
        updatedAt: now,
      }

      queryClient.setQueriesData<Completion[]>({ queryKey: COMPLETIONS_QUERY_KEY }, (old) =>
        old ? [...old, optimistic] : [optimistic],
      )

      return { tempId }
    },
    onSuccess: (id, _vars, context) => {
      queryClient.setQueriesData<Completion[]>({ queryKey: COMPLETIONS_QUERY_KEY }, (old) =>
        (old ?? []).map((c) => (c.id === context.tempId ? { ...c, id } : c)),
      )
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: COMPLETIONS_QUERY_KEY })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COMPLETIONS_QUERY_KEY })
    },
  })

  return {
    addCompletion: (data: CreateCompletion) => mutate({ ...data }),
  }
}
