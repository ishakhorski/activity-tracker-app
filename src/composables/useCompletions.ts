import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import type { Completion } from '@/types/completion'
import * as completionsService from '@/services/completionsService'
import { getDateRange } from '@/utils/completions'

const COMPLETIONS_QUERY_KEY = ['complitions'] as const

// --- Query ---

export const useCompletionsQuery = () => {
  return useQuery({
    queryKey: COMPLETIONS_QUERY_KEY,
    queryFn: async () => {
      const { from, to } = getDateRange()
      const response = await completionsService.getCompletionsByDateRange(from, to)
      return response.data
    },
  })
}

// --- Mutations ---

export const useCompletionCreateMutation = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: ({ activityId, date }: { activityId: string; date: string }) =>
      completionsService.createCompletion(activityId, date),
    onMutate: async ({ activityId, date }) => {
      await queryClient.cancelQueries({ queryKey: COMPLETIONS_QUERY_KEY })
      const previous = queryClient.getQueryData<Completion[]>(COMPLETIONS_QUERY_KEY)

      const now = new Date().toISOString()
      const optimistic: Completion = {
        id: `temp-${crypto.randomUUID()}`,
        activityId,
        completedAt: date,
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
    addCompletion: (activityId: string, date: string) => mutate({ activityId, date }),
  }
}

export const useCompletionDeleteMutation = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: (completionId: string) => completionsService.deleteCompletion(completionId),
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
