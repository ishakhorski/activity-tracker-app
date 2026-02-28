import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getActivityMembers } from '@/services/activityMembersService'

const ACTIVITY_MEMBERS_QUERY_KEY = 'activity-members' as const

export const useActivityMembersQuery = (activityId: MaybeRefOrGetter<string>) => {
  return useQuery({
    queryKey: computed(() => [ACTIVITY_MEMBERS_QUERY_KEY, toValue(activityId)]),
    queryFn: async () => {
      const response = await getActivityMembers(toValue(activityId))
      return response.data
    },
  })
}
