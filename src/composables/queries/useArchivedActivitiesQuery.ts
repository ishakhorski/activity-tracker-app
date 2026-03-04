import { useQuery } from '@tanstack/vue-query'

import { getActivities } from '@/services/activitiesService'
import { ACTIVITIES_QUERY_KEY } from './useActivitiesQuery'

export const ARCHIVED_ACTIVITIES_QUERY_KEY = [ACTIVITIES_QUERY_KEY, 'archived'] as const

export const useArchivedActivitiesQuery = () => {
  return useQuery({
    queryKey: ARCHIVED_ACTIVITIES_QUERY_KEY,
    queryFn: async () => {
      const response = await getActivities({ archived: true })
      return response.data.sort(
        (a, b) => new Date(b.archivedAt!).getTime() - new Date(a.archivedAt!).getTime(),
      )
    },
  })
}
