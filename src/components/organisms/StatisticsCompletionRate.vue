<script setup lang="ts">
import CompletionRateChart from '@/components/molecules/statistics/CompletionRateChart.vue'
import CompletionRateSummary from '@/components/molecules/statistics/CompletionRateSummary.vue'
import CompletionRateSummarySkeleton from '@/components/molecules/statistics/CompletionRateSummarySkeleton.vue'
import CompletionRateSummaryError from '@/components/molecules/statistics/CompletionRateSummaryError.vue'
import ChartSkeleton from '@/components/molecules/statistics/ChartSkeleton.vue'
import ChartError from '@/components/molecules/statistics/ChartError.vue'

import { useStatisticsQuery } from '@/composables/queries/useStatisticsQuery'
import { STATISTIC_TYPE, type CompletionRateStatistic } from '@/types/statistics'

const props = defineProps<{
  dateFrom: string
  dateTo: string
}>()

const {
  data: crData,
  isLoading: crIsLoading,
  isError: crIsError,
  refetch: crRefetch,
} = useStatisticsQuery<CompletionRateStatistic>(
  STATISTIC_TYPE.COMPLETION_RATE,
  props.dateFrom,
  props.dateTo,
)
</script>

<template>
  <div class="flex flex-col gap-1">
    <CompletionRateSummarySkeleton v-if="crIsLoading" />
    <CompletionRateSummaryError v-else-if="crIsError" @retry="crRefetch" />
    <CompletionRateSummary v-else-if="crData" :summary="crData.summary" />

    <div class="glass rounded-2xl px-4 pt-3 pb-4">
      <p class="text-sm font-medium mb-4">Completion rate over time</p>
      <ChartSkeleton v-if="crIsLoading" />
      <ChartError v-else-if="crIsError" />
      <CompletionRateChart v-else-if="crData" :data="crData.data" />
    </div>
  </div>
</template>
