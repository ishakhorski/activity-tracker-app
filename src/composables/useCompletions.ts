import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import type { Completion, CreateCompletion } from '@/types/completion'
import {
  getCompletionsByDateRange,
  createCompletion,
  deleteCompletion,
} from '@/services/completionsService'
import { getDateRange } from '@/utils/completions'
import { useAuth } from '@/composables/useAuth'

const COMPLETIONS_QUERY_KEY = ['complitions'] as const

// --- Query ---

export const useCompletionsQuery = () => {
  return useQuery({
    queryKey: COMPLETIONS_QUERY_KEY,
    queryFn: async () => {
      const { from, to } = getDateRange()
      const response = await getCompletionsByDateRange(from, to)
      return response.data
    },
  })
}

// --- Mutations ---

export const useCompletionCreateMutation = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { mutate } = useMutation({
    mutationFn: (data: CreateCompletion) => createCompletion(data),
    onMutate: async (data: CreateCompletion) => {
      await queryClient.cancelQueries({ queryKey: COMPLETIONS_QUERY_KEY })
      const previous = queryClient.getQueryData<Completion[]>(COMPLETIONS_QUERY_KEY)

      const now = new Date().toISOString()
      const optimistic: Completion = {
        id: `temp-${crypto.randomUUID()}`,
        activityId: data.activityId,
        userId: data.userId,
        completedAt: data.completedAt,
        note: data.note,
        createdAt: now,
        updatedAt: now,
      }

      queryClient.setQueryData<Completion[]>(COMPLETIONS_QUERY_KEY, (old) => [
        ...(old ?? []),
        optimistic,
      ])

      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(COMPLETIONS_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COMPLETIONS_QUERY_KEY })
    },
  })

  return {
    addCompletion: (data: Omit<CreateCompletion, 'userId'>) =>
      mutate({ ...data, userId: user.value?.id ?? '' }),
  }
}

export const useCompletionDeleteMutation = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: (completionId: string) => deleteCompletion(completionId),
    onMutate: async (completionId) => {
      await queryClient.cancelQueries({ queryKey: COMPLETIONS_QUERY_KEY })
      const previous = queryClient.getQueryData<Completion[]>(COMPLETIONS_QUERY_KEY)

      queryClient.setQueryData<Completion[]>(COMPLETIONS_QUERY_KEY, (old) =>
        (old ?? []).filter((c) => c.id !== completionId),
      )

      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(COMPLETIONS_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COMPLETIONS_QUERY_KEY })
    },
  })

  return { removeCompletion: (completionId: string) => mutate(completionId) }
}
