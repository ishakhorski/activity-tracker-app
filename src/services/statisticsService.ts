import { http } from './http'

import type { ActivityStatistic, Statistic, StatisticType } from '@/types/statistics'

export const getStatistics = <T extends Statistic = Statistic>(
  type: StatisticType,
  dateRange: {
    dateFrom: string
    dateTo: string
  },
): Promise<T> =>
  http.get<T>(`/statistics/${type}`, {
    params: { from: dateRange.dateFrom, to: dateRange.dateTo },
  })

export const getActivityStatistics = <T extends Statistic = Statistic>(
  activityId: string,
  type: StatisticType,
  dateRange: {
    dateFrom: string
    dateTo: string
  },
): Promise<ActivityStatistic<T>> =>
  http.get<ActivityStatistic<T>>(`/activities/${activityId}/statistics/${type}`, {
    params: { from: dateRange.dateFrom, to: dateRange.dateTo },
  })
