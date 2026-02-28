<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import PageHeader from '@/components/molecules/PageHeader.vue'
import PageContent from '@/components/molecules/PageContent.vue'
import { BaseButton } from '@/components/atoms/button'
import IconArrowRight from '@/assets/icons/arrow-right.svg?component'
import IconArchive from '@/assets/icons/archive.svg?component'

import { useActivitiesQuery } from '@/composables/queries/useActivitiesQuery'
import { ACTIVITY_SCHEDULE_TYPE } from '@/types/activitySchedule'
import { WEEKDAY_LABELS, WEEKDAYS_ORDERED } from '@/types/weekday'

const { data: activitiesData, isLoading } = useActivitiesQuery()

const archivedActivities = computed(() =>
  (activitiesData.value ?? [])
    .filter((a) => a.archivedAt !== null)
    .sort((a, b) => new Date(b.archivedAt!).getTime() - new Date(a.archivedAt!).getTime()),
)

function scheduleLabel(activity: (typeof archivedActivities.value)[number]): string {
  const s = activity.schedule
  if (s.type === ACTIVITY_SCHEDULE_TYPE.DAILY) {
    return `Daily · ${s.targetCompletions}× per day`
  }
  const days = WEEKDAYS_ORDERED.filter((d) => s.days.includes(d))
    .map((d) => WEEKDAY_LABELS[d])
    .join(', ')
  return `${days} · ${s.targetCompletions}× per session`
}
</script>

<template>
  <PageHeader>
    <RouterLink v-slot="{ navigate }" :to="{ name: 'settings-view' }" custom>
      <BaseButton as="a" variant="secondary" size="small" class="w-fit" @click="navigate">
        <IconArrowRight class="rotate-180 size-3.5" aria-hidden="true" />
        Settings
      </BaseButton>
    </RouterLink>
    <h1 class="font-bold text-xl text-center">Archive</h1>
  </PageHeader>

  <PageContent>
    <!-- Loading skeleton -->
    <div v-if="isLoading" class="flex flex-col gap-3">
      <div
        v-for="(widths, i) in [
          ['w-28', 'w-40'],
          ['w-36', 'w-52'],
          ['w-24', 'w-44'],
          ['w-32', 'w-48'],
        ]"
        :key="i"
        class="glass rounded-2xl px-4 py-3 flex items-center gap-4"
      >
        <div class="flex-1 min-w-0">
          <div :class="[widths[0], 'h-5 rounded-full bg-foreground/8 animate-pulse']" />
          <div :class="[widths[1], 'h-4 rounded-full bg-foreground/8 animate-pulse mt-0.5']" />
        </div>
        <div class="size-5 rounded-sm bg-foreground/8 animate-pulse shrink-0" />
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="archivedActivities.length === 0"
      class="flex flex-col items-center justify-center h-full gap-2 pb-16"
    >
      <IconArchive class="size-12 text-muted-foreground/20" />
      <p class="text-sm text-muted-foreground">No archived activities</p>
    </div>

    <!-- List -->
    <div v-else class="flex flex-col gap-3">
      <RouterLink
        v-for="activity in archivedActivities"
        :key="activity.id"
        :to="{
          name: 'activity-details',
          params: { id: activity.id, type: activity.type },
          query: { from: 'archived' },
        }"
        class="glass rounded-2xl px-4 py-3 flex items-center gap-4 transition-colors active:bg-foreground/5"
      >
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ activity.title }}</p>
          <p class="text-xs text-muted-foreground mt-0.5 truncate">{{ scheduleLabel(activity) }}</p>
        </div>
        <IconArrowRight class="size-4 text-muted-foreground/40 shrink-0" aria-hidden="true" />
      </RouterLink>
    </div>
  </PageContent>
</template>
