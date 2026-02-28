import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getActivityById } from '@/services/activitiesService'

export const useActivityQuery = (id: Ref<string>) => {
  return useQuery({
    queryKey: computed(() => ['activity', id.value] as const),
    queryFn: () => getActivityById(id.value),
  })
}
