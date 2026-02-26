<script setup lang="ts">
import { computed } from 'vue'

import { BaseButton } from '@/components/atoms/button'
import ActivityMonthGrid from '@/components/molecules/ActivityMonthGrid.vue'
import IconArrowRight from '@/assets/icons/arrow-right.svg?component'

import type { ActivitySchedule } from '@/types/activitySchedule'
import type { Completion } from '@/types/completion'

const props = defineProps<{
  schedule: ActivitySchedule
  completionsByDate: Record<string, Completion[]>
  from: string
  loading: boolean
  canGoPrev: boolean
  canGoNext: boolean
  isCurrentMonth: boolean
  slideDirection: 'left' | 'right'
}>()

const emit = defineEmits<{
  prev: []
  next: []
  today: []
  click: [date: string]
}>()

const monthLabel = computed(() => {
  const [y, m] = props.from.split('-').map(Number)
  return new Date(y, m - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const slideTransitionName = computed(() => `month-slide-${props.slideDirection}`)
</script>

<template>
  <div class="glass rounded-2xl px-4 py-3 flex flex-col gap-3">
    <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <BaseButton
        variant="secondary"
        size="medium"
        class="w-fit"
        :disabled="!canGoPrev"
        @click="emit('prev')"
      >
        <IconArrowRight class="rotate-180 size-4" aria-hidden="true" />
      </BaseButton>

      <span class="text-sm font-medium text-center tabular-nums">{{ monthLabel }}</span>

      <div class="flex items-center gap-1 justify-end">
        <BaseButton
          :variant="isCurrentMonth ? 'primary' : 'secondary'"
          size="small"
          @click="emit('today')"
        >
          Today
        </BaseButton>
        <BaseButton variant="secondary" size="medium" :disabled="!canGoNext" @click="emit('next')">
          <IconArrowRight class="size-4" aria-hidden="true" />
        </BaseButton>
      </div>
    </div>

    <div class="overflow-hidden">
      <Transition :name="slideTransitionName" mode="out-in">
        <ActivityMonthGrid
          :key="from"
          :schedule="schedule"
          :completions-by-date="completionsByDate"
          :from="from"
          :loading="loading"
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
