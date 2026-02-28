import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getActivityById } from '@/services/activitiesService'

export const ACTIVITY_QUERY_KEY = 'activity' as const

export const useActivityQuery = (activityId: MaybeRefOrGetter<string>) => {
  return useQuery({
    queryKey: computed(() => [ACTIVITY_QUERY_KEY, toValue(activityId)] as const),
    queryFn: async () => getActivityById(toValue(activityId)),
  })
}
