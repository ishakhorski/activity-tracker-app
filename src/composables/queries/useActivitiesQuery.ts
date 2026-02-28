import { useQuery } from '@tanstack/vue-query'

import { getActivities } from '@/services/activitiesService'

export const ACTIVITIES_QUERY_KEY = 'activities' as const

export const useActivitiesQuery = () => {
  return useQuery({
    queryKey: [ACTIVITIES_QUERY_KEY],
    queryFn: async () => {
      const response = await getActivities()
      return response.data
    },
  })
}
