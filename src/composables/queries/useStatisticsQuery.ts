import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getStatistics } from '@/services/statisticsService'
import type { Statistic, StatisticType } from '@/types/statistics'

export const STATISTICS_QUERY_KEY = ['statistics'] as const

const STALE_TIME = 5 * 60 * 1000

export const useStatisticsQuery = <T extends Statistic = Statistic>(
  type: Ref<StatisticType>,
  from: Ref<string>,
  to: Ref<string>,
) => {
  return useQuery({
    queryKey: computed(() => [...STATISTICS_QUERY_KEY, type.value, from.value, to.value]),
    queryFn: () => getStatistics<T>(type.value, { dateFrom: from.value, dateTo: to.value }),
    staleTime: STALE_TIME,
  })
}
