<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouteQuery } from '@vueuse/router'

import { BaseButton } from '@/components/atoms/button'
import {
  BaseSegmentedControl,
  BaseSegmentedControlButton,
} from '@/components/atoms/segmented-control'
import { BaseToggleButton } from '@/components/atoms/toggle-button'
import PageHeader from '@/components/molecules/PageHeader.vue'
import PageContent from '@/components/molecules/PageContent.vue'
import CreateActivityDialog from '@/components/organisms/CreateActivityDialog.vue'
import ActivityCard from '@/components/organisms/ActivityCard.vue'

import IconPlus from '@/assets/icons/plus.svg'
import IconCalendar from '@/assets/icons/calendar.svg'
import IconList from '@/assets/icons/list.svg'
import IconCheckmarkStack from '@/assets/icons/checkmark-stack.svg'
import IconCheckmarkStackFill from '@/assets/icons/checkmark-stack-fill.svg'
import IconCloudBoltFill from '@/assets/icons/cloud-bolt-fill.svg'

import { useActivities, isScheduledToday } from '@/composables/useActivities'
import { useCompletions } from '@/composables/useCompletions'

const { sortedActivities, isTargetMet, archiveActivity, deleteActivity } = useActivities()
const { addCompletion, getCompletions } = useCompletions()

const isCreateDialogOpen = ref(false)

const showFilter = useRouteQuery<string>('show', 'all')

const hideDoneQuery = useRouteQuery<string>('hideDone', 'false')
const hideCompleted = computed({
  get: () => hideDoneQuery.value === 'true',
  set: (val: boolean) => (hideDoneQuery.value = val ? 'true' : 'false'),
})

const filteredActivities = computed(() => {
  return sortedActivities.value.filter((activity) => {
    if (showFilter.value === 'today' && !isScheduledToday(activity)) return false
    if (hideCompleted.value && isTargetMet(activity)) return false
    return true
  })
})
</script>

<template>
  <PageHeader>
    <div class="flex items-center justify-between">
      <h1 class="font-bold text-2xl">Activities</h1>
      <BaseButton variant="secondary" @click="isCreateDialogOpen = true">
        <IconPlus class="size-4" />
        <span class="sr-only">Add Activity</span>
      </BaseButton>
    </div>

    <div class="flex items-center gap-2">
      <BaseSegmentedControl v-model="showFilter">
        <BaseSegmentedControlButton value="all">
          <IconList class="size-4" />
          All
        </BaseSegmentedControlButton>
        <BaseSegmentedControlButton value="today">
          <IconCalendar class="size-4" />
          Today
        </BaseSegmentedControlButton>
      </BaseSegmentedControl>

      <BaseToggleButton v-model="hideCompleted">
        <IconCheckmarkStackFill v-if="hideCompleted" class="size-4" />
        <IconCheckmarkStack v-else class="size-4" />
        Hide done
      </BaseToggleButton>
    </div>
  </PageHeader>

  <PageContent>
    <div
      v-if="filteredActivities.length === 0"
      class="flex flex-col items-center justify-center h-full gap-4 pb-16"
    >
      <IconCloudBoltFill class="size-16 text-muted-foreground/20 animate-empty-bounce" />
      <div class="text-center">
        <p class="text-sm font-medium text-muted-foreground">No activities yet</p>
        <p class="text-xs text-muted-foreground/60 mt-1">Start tracking your first activity</p>
      </div>
      <BaseButton
        variant="primary"
        size="medium"
        class="animate-empty-pulse"
        @click="isCreateDialogOpen = true"
      >
        <IconPlus class="size-4" />
        <span class="sr-only">Add Activity</span>
      </BaseButton>
    </div>

    <TransitionGroup v-else name="activity-list" tag="div" class="flex flex-col gap-3">
      <ActivityCard
        v-for="activity in filteredActivities"
        :key="activity.id"
        :activity="activity"
        :completions="getCompletions(activity.id)"
        @complete="addCompletion"
        @archive="archiveActivity"
        @delete="deleteActivity"
      />
    </TransitionGroup>
  </PageContent>

  <CreateActivityDialog v-model:open="isCreateDialogOpen" />
</template>

<style scoped>
.activity-list-move {
  transition: transform 0.4s ease;
}

@keyframes empty-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes empty-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-empty-bounce {
  animation: empty-bounce 3s ease-in-out infinite;
}

.animate-empty-pulse {
  animation: empty-pulse 2s ease-in-out infinite;
}
</style>
