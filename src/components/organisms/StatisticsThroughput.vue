<script setup lang="ts">
import ThroughputChart from '@/components/molecules/statistics/ThroughputChart.vue'
import ThroughputSummary from '@/components/molecules/statistics/ThroughputSummary.vue'
import ThroughputSummarySkeleton from '@/components/molecules/statistics/ThroughputSummarySkeleton.vue'
import ThroughputSummaryError from '@/components/molecules/statistics/ThroughputSummaryError.vue'
import ChartSkeleton from '@/components/molecules/statistics/ChartSkeleton.vue'
import ChartError from '@/components/molecules/statistics/ChartError.vue'

import { useStatisticsQuery } from '@/composables/queries/useStatisticsQuery'
import { STATISTIC_TYPE, type ThroughputStatistic } from '@/types/statistics'

const props = defineProps<{
  dateFrom: string
  dateTo: string
}>()

const {
  data: tpData,
  isLoading: tpIsLoading,
  isError: tpIsError,
  refetch: tpRefetch,
} = useStatisticsQuery<ThroughputStatistic>(STATISTIC_TYPE.THROUGHPUT, props.dateFrom, props.dateTo)
</script>

<template>
  <div class="flex flex-col gap-1">
    <ThroughputSummarySkeleton v-if="tpIsLoading" />
    <ThroughputSummaryError v-else-if="tpIsError" @retry="tpRefetch" />
    <ThroughputSummary v-else-if="tpData" :summary="tpData.summary" />

    <div class="glass rounded-2xl px-4 pt-3 pb-4">
      <p class="text-sm font-medium mb-4">Completions over time</p>
      <ChartSkeleton v-if="tpIsLoading" />
      <ChartError v-else-if="tpIsError" />
      <ThroughputChart v-else-if="tpData" :data="tpData.data" />
    </div>
  </div>
</template>
