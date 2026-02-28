import { useMutation, useQueryClient } from '@tanstack/vue-query'

import type { Activity, UpdateActivity } from '@/types/activity'
import { updateActivity } from '@/services/activitiesService'
import { ACTIVITIES_QUERY_KEY } from '@/composables/queries/useActivitiesQuery'
import { ACTIVITY_QUERY_KEY } from '@/composables/queries/useActivityQuery'

export const useActivityUpdateMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateActivity }) => updateActivity(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [ACTIVITIES_QUERY_KEY] })
      await queryClient.cancelQueries({ queryKey: [ACTIVITY_QUERY_KEY, id] })
      const previous = queryClient.getQueryData<Activity[]>([ACTIVITIES_QUERY_KEY])
      const previousSingle = queryClient.getQueryData<Activity>([ACTIVITY_QUERY_KEY, id])

      const now = new Date().toISOString()
      queryClient.setQueryData<Activity[]>([ACTIVITIES_QUERY_KEY], (old) =>
        (old ?? []).map((a) => (a.id === id ? { ...a, ...data, updatedAt: now } : a)),
      )
      queryClient.setQueryData<Activity>([ACTIVITY_QUERY_KEY, id], (old) =>
        old ? { ...old, ...data, updatedAt: now } : old,
      )

      return { previous, previousSingle }
    },
    onError: (_err, { id }, context) => {
      if (context?.previous) {
        queryClient.setQueryData([ACTIVITIES_QUERY_KEY], context.previous)
      }
      if (context?.previousSingle) {
        queryClient.setQueryData([ACTIVITY_QUERY_KEY, id], context.previousSingle)
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: [ACTIVITIES_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [ACTIVITY_QUERY_KEY, id] })
    },
  })
}
