import { computed, type Ref } from 'vue'
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

export const useActivityMonthCompletionsQuery = (
  activityId: Ref<string>,
  year: Ref<number>,
  month: Ref<number>,
) => {
  return useQuery({
    queryKey: computed(() => ['completions', 'month', activityId.value, year.value, month.value]),
    queryFn: async () => {
      const from = new Date(year.value, month.value, 1)
      const to = new Date(year.value, month.value + 1, 0, 23, 59, 59, 999)
      const response = await getCompletionsByDateRange(from.toISOString(), to.toISOString())
      return response.data.filter((c) => c.activityId === activityId.value)
    },
  })
}

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

      queryClient.setQueryData<Completion[]>(COMPLETIONS_QUERY_KEY, (old) => [
        ...(old ?? []),
        optimistic,
      ])

      return { previous, tempId }
    },
    onSuccess: (id, _vars, context) => {
      queryClient.setQueryData<Completion[]>(COMPLETIONS_QUERY_KEY, (old) =>
        (old ?? []).map((c) => (c.id === context.tempId ? { ...c, id } : c)),
      )
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(COMPLETIONS_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COMPLETIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['completions', 'month'] })
    },
  })

  return {
    addCompletion: (data: CreateCompletion) => mutate({ ...data }),
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
