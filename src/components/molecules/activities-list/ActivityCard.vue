<script setup lang="ts">
import { computed, ref } from 'vue'
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
const weekTo = computed(() => toLocalDateKey(new Date()))

const trackBtn = ref<InstanceType<typeof ActivityTrackButton> | null>(null)

defineExpose({ play: () => trackBtn.value?.play() })
</script>

<template>
  <RouterLink
    v-slot="{ navigate }"
    custom
    :to="{ name: 'activity-details', params: { id: activity.id, type: activity.type } }"
  >
    <div
      class="relative w-full glass rounded-2xl px-3 py-4 flex items-center gap-3 touch-manipulation"
      @click="navigate"
    >
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <RouterLink
            :to="{ name: 'activity-details', params: { id: activity.id, type: activity.type } }"
          >
            <h3 class="font-semibold text-sm truncate">{{ activity.title }}</h3>
          </RouterLink>

          <span
            v-if="todayTarget > 0 || todayCount > 0"
            class="text-[10px] text-muted-foreground tabular-nums leading-none"
          >
            {{ todayTarget > 0 ? `${todayCount}/${todayTarget}` : todayCount }}
          </span>
        </div>

        <ActivityWeekGrid
          :schedule="activity.schedule"
          :completions-by-date="activity.completionsByDate"
          :from="weekFrom"
          :to="weekTo"
          class="mt-3"
        />
      </div>

      <div class="relative flex flex-col items-center gap-1" @click.stop>
        <ActivityTrackButton
          ref="trackBtn"
          :variant="isCompleted ? 'primary' : 'secondary'"
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
  </RouterLink>
</template>
