import { useQuery } from '@tanstack/vue-query'

import { getAllActivities } from '@/services/activitiesService'

export const ACTIVITIES_QUERY_KEY = ['activities'] as const

export const useActivitiesQuery = () => {
  return useQuery({
    queryKey: ACTIVITIES_QUERY_KEY,
    queryFn: async () => {
      const response = await getAllActivities()
      return response.data
    },
  })
}
