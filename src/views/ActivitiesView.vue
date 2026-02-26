<script setup lang="ts">
import { computed } from 'vue'
import { useConfirmDialog } from '@vueuse/core'

import PageHeader from '@/components/molecules/PageHeader.vue'
import PageContent from '@/components/molecules/PageContent.vue'
import ActivityCard from '@/components/organisms/ActivityCard.vue'
import ActivitiesSkeleton from '@/components/organisms/ActivitiesSkeleton.vue'
import ActivitiesOnboarding from '@/components/organisms/ActivitiesOnboarding.vue'
import CreateCompletionDialog from '@/components/organisms/CreateCompletionDialog.vue'

import { useActivitiesQuery } from '@/composables/useActivities'
import { useCompletionsQuery, useCompletionCreateMutation } from '@/composables/useCompletions'
import { useCreateActivityDialog } from '@/composables/useCreateActivityDialog'
import { enrichActivity } from '@/utils/activities'

import type { CreateCompletion } from '@/types/completion'

const { openCreateActivityDialog } = useCreateActivityDialog()
const { addCompletion } = useCompletionCreateMutation()

const { data: activitiesData, isLoading: activitiesLoading } = useActivitiesQuery()
const { data: completionsData, isLoading: completionsLoading } = useCompletionsQuery()

const isLoading = computed(() => activitiesLoading.value || completionsLoading.value)

const enrichedActivities = computed(() => {
  const activities = activitiesData.value ?? []
  const completions = completionsData.value ?? []
  return activities.filter((a) => !a.archivedAt).map((a) => enrichActivity(a, completions))
})

const handleAddCompletion = (activityId: string) => {
  addCompletion({ activityId, note: null, completedAt: new Date().toISOString() })
}

const {
  isRevealed: isCompletionDialog,
  reveal: openCompletionDialog,
  confirm: confirmCompletionDialog,
  cancel: cancelCompletionDialog,
} = useConfirmDialog<Omit<CreateCompletion, 'activityId'>>()

const handleAddCompletionWithNote = async (activityId: string) => {
  const { data, isCanceled } = await openCompletionDialog()
  if (!isCanceled && data) {
    addCompletion({ activityId, note: data.note, completedAt: new Date().toISOString() })
  }
}
</script>

<template>
  <PageHeader>
    <h1 class="font-bold text-2xl">Activities</h1>
  </PageHeader>

  <PageContent>
    <ActivitiesSkeleton v-if="isLoading" :count="4" />

    <ActivitiesOnboarding
      v-else-if="enrichedActivities.length === 0"
      @create="openCreateActivityDialog"
    />

    <TransitionGroup v-else tag="div" name="activity-list" class="relative flex flex-col gap-3">
      <ActivityCard
        v-for="activity in enrichedActivities"
        :key="activity.title"
        :activity="activity"
        @complete="handleAddCompletion(activity.id)"
        @complete:long-press="handleAddCompletionWithNote(activity.id)"
      />
    </TransitionGroup>
  </PageContent>

  <CreateCompletionDialog
    v-model:open="isCompletionDialog"
    :cancel="cancelCompletionDialog"
    :confirm="confirmCompletionDialog"
  />
</template>

<style>
.activity-list-move,
.activity-list-enter-active,
.activity-list-leave-active {
  transition:
    transform 0.4s ease,
    opacity 0.4s ease;
}

.activity-list-enter-from,
.activity-list-leave-to {
  opacity: 0;
}

.activity-list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
