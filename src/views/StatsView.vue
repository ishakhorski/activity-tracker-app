<script setup lang="ts">
import { computed } from 'vue'
import { useRouteQuery } from '@vueuse/router'
import { format, subDays } from 'date-fns'

import PageHeader from '@/components/molecules/PageHeader.vue'
import PageContent from '@/components/molecules/PageContent.vue'
import CompletionRateChart from '@/components/molecules/CompletionRateChart.vue'
import CompletionRateSummary from '@/components/molecules/CompletionRateSummary.vue'
import CompletionRateSummarySkeleton from '@/components/molecules/CompletionRateSummarySkeleton.vue'
import ThroughputChart from '@/components/molecules/ThroughputChart.vue'
import ThroughputSummary from '@/components/molecules/ThroughputSummary.vue'
import ThroughputSummarySkeleton from '@/components/molecules/ThroughputSummarySkeleton.vue'
import ChartCardSkeleton from '@/components/molecules/ChartCardSkeleton.vue'
import StatisticsError from '@/components/molecules/StatisticsError.vue'
import {
  BaseSegmentedControl,
  BaseSegmentedControlButton,
} from '@/components/atoms/segmented-control'

import { useStatisticsQuery } from '@/composables/queries/useStatisticsQuery'
import {
  STATISTIC_TYPE,
  type CompletionRateStatistic,
  type ThroughputStatistic,
} from '@/types/statistics'

const RANGE_OPTIONS = [
  { label: '30 days', value: '30' },
  { label: '3 months', value: '90' },
  { label: '1 year', value: '365' },
]

const range = useRouteQuery('range', '30')

const dateFrom = computed(() => format(subDays(new Date(), parseInt(range.value)), 'yyyy-MM-dd'))
const dateTo = computed(() => format(new Date(), 'yyyy-MM-dd'))

const {
  data: crData,
  isLoading: crIsLoading,
  isError: crIsError,
  refetch: crRefetch,
} = useStatisticsQuery<CompletionRateStatistic>(STATISTIC_TYPE.COMPLETION_RATE, dateFrom, dateTo)

const {
  data: tpData,
  isLoading: tpIsLoading,
  isError: tpIsError,
  refetch: tpRefetch,
} = useStatisticsQuery<ThroughputStatistic>(STATISTIC_TYPE.THROUGHPUT, dateFrom, dateTo)
</script>

<template>
  <PageHeader>
    <h1 class="font-bold text-2xl">Statistics</h1>
    <BaseSegmentedControl v-model="range">
      <BaseSegmentedControlButton v-for="opt in RANGE_OPTIONS" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </BaseSegmentedControlButton>
    </BaseSegmentedControl>
  </PageHeader>

  <PageContent>
    <div class="grid gap-3">
      <template v-if="crIsLoading">
        <CompletionRateSummarySkeleton />
        <ChartCardSkeleton />
      </template>
      <template v-else-if="crIsError">
        <StatisticsError @retry="crRefetch" />
      </template>
      <template v-else-if="crData">
        <CompletionRateSummary :summary="crData.summary" />
        <div class="glass rounded-2xl px-4 pt-3 pb-4">
          <p class="text-sm font-medium mb-4">Completion rate over time</p>
          <CompletionRateChart :data="crData.data" />
        </div>
      </template>

      <template v-if="tpIsLoading">
        <ThroughputSummarySkeleton />
        <ChartCardSkeleton />
      </template>
      <template v-else-if="tpIsError">
        <StatisticsError @retry="tpRefetch" />
      </template>
      <template v-else-if="tpData">
        <ThroughputSummary :summary="tpData.summary" />
        <div class="glass rounded-2xl px-4 pt-3 pb-4">
          <p class="text-sm font-medium mb-4">Completions over time</p>
          <ThroughputChart :data="tpData.data" />
        </div>
      </template>
    </div>
  </PageContent>
</template>
