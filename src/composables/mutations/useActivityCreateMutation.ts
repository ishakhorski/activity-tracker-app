import { useMutation, useQueryClient } from '@tanstack/vue-query'

import type { Activity, CreateActivity } from '@/types/activity'
import { createActivity } from '@/services/activitiesService'
import { ACTIVITIES_QUERY_KEY } from '@/composables/queries/useActivitiesQuery'

export const useActivityCreateMutation = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: (data: CreateActivity) => createActivity(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ACTIVITIES_QUERY_KEY })
      const previous = queryClient.getQueryData<Activity[]>(ACTIVITIES_QUERY_KEY)

      const now = new Date().toISOString()
      const tempId = `temp-${crypto.randomUUID()}`
      const optimistic: Activity = {
        id: tempId,
        title: data.title,
        description: data.description,
        type: data.type,
        schedule: data.schedule,
        createdAt: now,
        updatedAt: now,
        archivedAt: null,
      }

      queryClient.setQueryData<Activity[]>(ACTIVITIES_QUERY_KEY, (old) => [
        ...(old ?? []),
        optimistic,
      ])

      return { previous, tempId }
    },
    onSuccess: (id, _vars, context) => {
      queryClient.setQueryData<Activity[]>(ACTIVITIES_QUERY_KEY, (old) =>
        (old ?? []).map((a) => (a.id === context.tempId ? { ...a, id } : a)),
      )
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ACTIVITIES_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY })
    },
  })

  return {
    createActivity: (data: CreateActivity) => mutate(data),
  }
}
