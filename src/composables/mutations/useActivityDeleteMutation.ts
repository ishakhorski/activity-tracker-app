import { useMutation, useQueryClient } from '@tanstack/vue-query'

import type { Activity } from '@/types/activity'
import { deleteActivity } from '@/services/activitiesService'
import { ACTIVITIES_QUERY_KEY } from '@/composables/queries/useActivitiesQuery'

export const useActivityDeleteMutation = () => {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (activityId: string) => deleteActivity(activityId),
    onMutate: async (activityId) => {
      await queryClient.cancelQueries({ queryKey: ACTIVITIES_QUERY_KEY })
      const previous = queryClient.getQueryData<Activity[]>(ACTIVITIES_QUERY_KEY)

      queryClient.setQueryData<Activity[]>(ACTIVITIES_QUERY_KEY, (old) =>
        (old ?? []).filter((a) => a.id !== activityId),
      )

      return { previous }
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
    deleteActivity: (activityId: string) => mutateAsync(activityId),
    isPending,
  }
}
