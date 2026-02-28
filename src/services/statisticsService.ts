import { http } from './http'

import type {
  ActivityStatistic,
  Statistic,
  StatisticType,
  StatisticsParams,
} from '@/types/statistics'

export const getStatistics = <T extends Statistic = Statistic>(
  type: StatisticType,
  params: StatisticsParams,
): Promise<T> =>
  http.get<T>(`/statistics/${type}`, {
    params: { from: params.dateFrom, to: params.dateTo },
  })

export const getActivityStatistics = <T extends Statistic = Statistic>(
  activityId: string,
  type: StatisticType,
  params: StatisticsParams,
): Promise<ActivityStatistic<T>> =>
  http.get<ActivityStatistic<T>>(`/activities/${activityId}/statistics/${type}`, {
    params: { from: params.dateFrom, to: params.dateTo },
  })
