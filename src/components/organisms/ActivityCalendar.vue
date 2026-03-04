<script setup lang="ts">
import { computed, ref } from 'vue'

import { BaseButton } from '@/components/atoms/button'
import MonthGrid from '@/components/molecules/MonthGrid.vue'
import IconArrowRight from '@/assets/icons/arrow-right.svg?component'

import { toLocalDateKey } from '@/utils/activities'
import { ACTIVITY_SCHEDULE_TYPE } from '@/types/activitySchedule'
import type { EnrichedActivity } from '@/types/activity'

const props = defineProps<{
  activity: EnrichedActivity | undefined
}>()

const emit = defineEmits<{
  click: [date: string]
}>()

const today = new Date()
const currentMonthKey = toLocalDateKey(new Date(today.getFullYear(), today.getMonth(), 1))

const viewFrom = ref(currentMonthKey)
const slideDirection = ref<'left' | 'right'>('left')

const viewYear = computed(() => parseInt(viewFrom.value.slice(0, 4)))
const viewMonth = computed(() => parseInt(viewFrom.value.slice(5, 7)) - 1)

const canGoPrev = computed(() => {
  if (!props.activity) return false
  const created = new Date(props.activity.createdAt)
  const createdFrom = toLocalDateKey(new Date(created.getFullYear(), created.getMonth(), 1))
  return viewFrom.value > createdFrom
})

const canGoNext = computed(() => viewFrom.value < currentMonthKey)
const isCurrentMonth = computed(() => viewFrom.value === currentMonthKey)

const goToToday = () => {
  slideDirection.value = viewFrom.value < currentMonthKey ? 'left' : 'right'
  viewFrom.value = currentMonthKey
}

const goToPrevMonth = () => {
  slideDirection.value = 'right'
  viewFrom.value = toLocalDateKey(new Date(viewYear.value, viewMonth.value - 1, 1))
}

const goToNextMonth = () => {
  slideDirection.value = 'left'
  viewFrom.value = toLocalDateKey(new Date(viewYear.value, viewMonth.value + 1, 1))
}

const monthLabel = computed(() => {
  const [y = 0, m = 1] = viewFrom.value.split('-').map(Number)
  return new Date(y, m - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const slideTransitionName = computed(() => `month-slide-${slideDirection.value}`)

const monthPrefix = computed(() => viewFrom.value.slice(0, 7))

const monthCompletionsByDate = computed(() => {
  if (!props.activity) return {}
  const result: typeof props.activity.completionsByDate = {}
  for (const [key, completions] of Object.entries(props.activity.completionsByDate)) {
    if (key.startsWith(monthPrefix.value)) {
      result[key] = completions
    }
  }
  return result
})

const schedule = computed(
  () =>
    props.activity?.schedule ?? {
      type: ACTIVITY_SCHEDULE_TYPE.DAILY,
      targetCompletions: 0,
    },
)

const isLoading = computed(() => !props.activity)
</script>

<template>
  <div class="glass rounded-2xl px-4 py-3 flex flex-col gap-3">
    <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <BaseButton
        variant="secondary"
        size="medium"
        class="w-fit"
        :disabled="!canGoPrev"
        @click="goToPrevMonth"
      >
        <IconArrowRight class="rotate-180 size-4" aria-hidden="true" />
      </BaseButton>

      <span v-if="!isLoading" class="text-sm font-medium text-center tabular-nums">
        {{ monthLabel }}
      </span>
      <span v-else class="h-4 w-24 rounded bg-muted animate-pulse" />

      <div class="flex items-center gap-1 justify-end">
        <BaseButton
          :variant="isCurrentMonth ? 'primary' : 'secondary'"
          size="small"
          @click="goToToday"
        >
          Today
        </BaseButton>
        <BaseButton variant="secondary" size="medium" :disabled="!canGoNext" @click="goToNextMonth">
          <IconArrowRight class="size-4" aria-hidden="true" />
        </BaseButton>
      </div>
    </div>

    <div class="overflow-hidden">
      <Transition :name="slideTransitionName" mode="out-in">
        <MonthGrid
          :key="viewFrom"
          :schedule="schedule"
          :completions-by-date="monthCompletionsByDate"
          :from="viewFrom"
          :loading="isLoading"
          @click="emit('click', $event)"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.month-slide-left-enter-active,
.month-slide-left-leave-active,
.month-slide-right-enter-active,
.month-slide-right-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}
.month-slide-left-enter-from {
  opacity: 0;
  transform: translateX(32px);
}
.month-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-32px);
}
.month-slide-right-enter-from {
  opacity: 0;
  transform: translateX(-32px);
}
.month-slide-right-leave-to {
  opacity: 0;
  transform: translateX(32px);
}
</style>
