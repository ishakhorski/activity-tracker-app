<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import ActivityWeekGrid from '@/components/molecules/ActivityWeekGrid.vue'
import ActivityTrackButton from '@/components/molecules/ActivityTrackButton.vue'

import { getDayStatus, getTargetForDay, toLocalDateKey } from '@/utils/activities'

import type { EnrichedActivity } from '@/types/activity'

const props = defineProps<{
  activity: EnrichedActivity
}>()

const emit = defineEmits<{
  complete: [id: string]
  'complete:long-press': [id: string]
}>()

const todayKey = computed(() => toLocalDateKey(new Date()))
const todayCount = computed(() => props.activity.completionsByDate[todayKey.value]?.length ?? 0)
const todayTarget = computed(() => getTargetForDay(props.activity.schedule, new Date().getDay()))
const isCompleted = computed(
  () => getDayStatus(todayCount.value, todayTarget.value) === 'completed',
)

const weekFrom = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() - 6)
  return toLocalDateKey(d)
})
</script>

<template>
  <div class="relative w-full glass rounded-2xl px-3 py-4 flex items-center gap-3">
    <div class="flex-1 min-w-0">
      <RouterLink
        :to="{ name: 'activity-details', params: { id: activity.id } }"
        class="w-full flex items-center gap-2"
      >
        <h3 class="font-semibold text-sm truncate">{{ activity.title }}</h3>
        <span class="text-[11px] text-muted-foreground tabular-nums shrink-0">
          {{ todayTarget > 0 ? `${todayCount}/${todayTarget}` : todayCount > 0 ? todayCount : '' }}
        </span>
      </RouterLink>

      <ActivityWeekGrid
        :schedule="activity.schedule"
        :completions-by-date="activity.completionsByDate"
        :from="weekFrom"
        class="mt-2"
      />
    </div>

    <div class="relative flex flex-col items-center gap-1">
      <ActivityTrackButton
        :completed="isCompleted"
        size="large"
        @click="emit('complete', activity.id)"
        @click:long-press="emit('complete:long-press', activity.id)"
      >
        <span class="sr-only">Complete</span>
      </ActivityTrackButton>
      <span
        class="absolute -bottom-3 text-[10px] text-muted-foreground/50 leading-none select-none whitespace-nowrap"
      >
        Hold for note
      </span>
    </div>
  </div>
</template>
