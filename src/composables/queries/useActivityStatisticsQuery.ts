import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getActivityStatistics } from '@/services/statisticsService'
import { STATISTICS_QUERY_KEY } from '@/composables/queries/useStatisticsQuery'
import type { Statistic, StatisticType } from '@/types/statistics'

const STALE_TIME = 5 * 60 * 1000

export const useActivityStatisticsQuery = <T extends Statistic = Statistic>(
  activityId: Ref<string>,
  type: Ref<StatisticType>,
  from: Ref<string>,
  to: Ref<string>,
) => {
  return useQuery({
    queryKey: computed(() => [
      ...STATISTICS_QUERY_KEY,
      'activity',
      activityId.value,
      type.value,
      from.value,
      to.value,
    ]),
    queryFn: () =>
      getActivityStatistics<T>(activityId.value, type.value, {
        dateFrom: from.value,
        dateTo: to.value,
      }),
    staleTime: STALE_TIME,
  })
}
