import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getActivityMembers } from '@/services/activityMembersService'

const ACTIVITY_MEMBERS_QUERY_KEY = (id: string) => ['activity-members', id] as const

export const useActivityMembersQuery = (activityId: Ref<string>) =>
  useQuery({
    queryKey: computed(() => ACTIVITY_MEMBERS_QUERY_KEY(activityId.value)),
    queryFn: () => getActivityMembers(activityId.value).then((r) => r.data),
  })
