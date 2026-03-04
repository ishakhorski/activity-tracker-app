<script setup lang="ts">
import { computed } from 'vue'
import { useRouteQuery } from '@vueuse/router'
import { format, subDays } from 'date-fns'

import {
  BaseSegmentedControl,
  BaseSegmentedControlButton,
} from '@/components/atoms/segmented-control'
import PageHeader from '@/components/molecules/PageHeader.vue'
import PageContent from '@/components/molecules/PageContent.vue'
import StatisticsCompletionRate from '@/components/organisms/StatisticsCompletionRate.vue'
import StatisticsThroughput from '@/components/organisms/StatisticsThroughput.vue'

const RANGE_OPTIONS = [
  { label: '30 days', value: '30' },
  { label: '3 months', value: '90' },
  { label: '1 year', value: '365' },
]

const range = useRouteQuery('range', '30')

const dateFrom = computed(() => format(subDays(new Date(), parseInt(range.value)), 'yyyy-MM-dd'))
const dateTo = computed(() => format(new Date(), 'yyyy-MM-dd'))
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

  <PageContent class="grid gap-3">
    <StatisticsCompletionRate :date-from="dateFrom" :date-to="dateTo" />
    <StatisticsThroughput :date-from="dateFrom" :date-to="dateTo" />
  </PageContent>
</template>
