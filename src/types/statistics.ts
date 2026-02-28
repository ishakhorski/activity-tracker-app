export const STATISTIC_TYPE = {
  COMPLETION_RATE: 'completion_rate',
  THROUGHPUT: 'throughput',
} as const
export type StatisticType = (typeof STATISTIC_TYPE)[keyof typeof STATISTIC_TYPE]

export interface CompletionRateDataPoint {
  date: string
  scheduled: number
  completed: number
  rate: number
}

export interface CompletionRateStatistic {
  type: typeof STATISTIC_TYPE.COMPLETION_RATE
  data: CompletionRateDataPoint[]
  summary: {
    scheduled: number
    completed: number
    rate: number
  }
}

export interface ThroughputDataPoint {
  date: string
  completed: number
}

export interface ThroughputStatistic {
  type: typeof STATISTIC_TYPE.THROUGHPUT
  data: ThroughputDataPoint[]
  summary: {
    total: number
    average: number
  }
}

export type Statistic = CompletionRateStatistic | ThroughputStatistic

export type ActivityStatistic<T extends Statistic = Statistic> = T & { activityId: string }
