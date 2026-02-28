import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getStatistics } from '@/services/statisticsService'
import type { Statistic, StatisticType } from '@/types/statistics'

export const STATISTICS_QUERY_KEY = 'statistics' as const

export const useStatisticsQuery = <T extends Statistic = Statistic>(
  statisticType: MaybeRefOrGetter<StatisticType>,
  dateFrom: MaybeRefOrGetter<string>,
  dateTo: MaybeRefOrGetter<string>,
) => {
  return useQuery({
    queryKey: computed(() => [
      STATISTICS_QUERY_KEY,
      toValue(statisticType),
      toValue(dateFrom),
      toValue(dateTo),
    ]),
    queryFn: () =>
      getStatistics<T>(toValue(statisticType), {
        dateFrom: toValue(dateFrom),
        dateTo: toValue(dateTo),
      }),
  })
}
