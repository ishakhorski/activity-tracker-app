<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouteQuery } from '@vueuse/router'

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
import { format, subDays } from 'date-fns'

import { useStatisticsQuery } from '@/composables/queries/useStatisticsQuery'
import { STATISTIC_TYPE } from '@/types/statistics'
import type { CompletionRateStatistic, ThroughputStatistic } from '@/types/statistics'

const RANGE_OPTIONS = [
  { label: '30 days', value: '30' },
  { label: '3 months', value: '90' },
  { label: '1 year', value: '365' },
]

const selectedRange = useRouteQuery('range', '30')

const from = computed(() =>
  format(subDays(new Date(), parseInt(selectedRange.value)), 'yyyy-MM-dd'),
)
const to = computed(() => format(new Date(), 'yyyy-MM-dd'))

const crType = ref(STATISTIC_TYPE.COMPLETION_RATE)
const tpType = ref(STATISTIC_TYPE.THROUGHPUT)

const crQuery = useStatisticsQuery<CompletionRateStatistic>(crType, from, to)
const tpQuery = useStatisticsQuery<ThroughputStatistic>(tpType, from, to)
</script>

<template>
  <PageHeader>
    <h1 class="font-bold text-2xl">Statistics</h1>
    <BaseSegmentedControl v-model="selectedRange">
      <BaseSegmentedControlButton v-for="opt in RANGE_OPTIONS" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </BaseSegmentedControlButton>
    </BaseSegmentedControl>
  </PageHeader>

  <PageContent>
    <div class="grid gap-3">
      <template v-if="crQuery.isLoading.value">
        <CompletionRateSummarySkeleton />
        <ChartCardSkeleton />
      </template>
      <template v-else-if="crQuery.isError.value">
        <StatisticsError @retry="() => crQuery.refetch()" />
      </template>
      <template v-else-if="crQuery.data.value">
        <CompletionRateSummary :summary="crQuery.data.value.summary" />
        <div class="glass rounded-2xl px-4 pt-3 pb-4">
          <p class="text-sm font-medium mb-4">Completion rate over time</p>
          <CompletionRateChart :data="crQuery.data.value.data" />
        </div>
      </template>

      <template v-if="tpQuery.isLoading.value">
        <ThroughputSummarySkeleton />
        <ChartCardSkeleton />
      </template>
      <template v-else-if="tpQuery.isError.value">
        <StatisticsError @retry="() => tpQuery.refetch()" />
      </template>
      <template v-else-if="tpQuery.data.value">
        <ThroughputSummary :summary="tpQuery.data.value.summary" />
        <div class="glass rounded-2xl px-4 pt-3 pb-4">
          <p class="text-sm font-medium mb-4">Completions over time</p>
          <ThroughputChart :data="tpQuery.data.value.data" />
        </div>
      </template>
    </div>
  </PageContent>
</template>
