import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getActivityStatistics } from '@/services/statisticsService'
import type { Statistic, StatisticType } from '@/types/statistics'

export const ACTIVITY_STATISTICS_QUERY_KEY = 'activity-statistics' as const

export const useActivityStatisticsQuery = <T extends Statistic = Statistic>(
  activityId: MaybeRefOrGetter<string>,
  statisticType: MaybeRefOrGetter<StatisticType>,
  dateFrom: MaybeRefOrGetter<string>,
  dateTo: MaybeRefOrGetter<string>,
) => {
  return useQuery({
    queryKey: computed(() => [
      ACTIVITY_STATISTICS_QUERY_KEY,
      toValue(activityId),
      toValue(statisticType),
      toValue(dateFrom),
      toValue(dateTo),
    ]),
    queryFn: () =>
      getActivityStatistics<T>(toValue(activityId), toValue(statisticType), {
        dateFrom: toValue(dateFrom),
        dateTo: toValue(dateTo),
      }),
  })
}
