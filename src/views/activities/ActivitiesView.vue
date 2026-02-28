<script setup lang="ts">
import PageHeader from '@/components/molecules/PageHeader.vue'
import PageContent from '@/components/molecules/PageContent.vue'
import ActivityCardSkeleton from '@/components/molecules/ActivityCardSkeleton.vue'
import ActivitiesOnboarding from '@/components/molecules/ActivitiesOnboarding.vue'
import ActivitiesError from '@/components/molecules/ActivitiesError.vue'
import ActivityCard from '@/components/organisms/ActivityCard.vue'
import CompletionCreateDialog from '@/components/organisms/CompletionCreateDialog.vue'

import { useEnrichedActivities } from '@/composables/useEnrichedActivities'
import { useTrackCompletion } from '@/composables/useTrackCompletion'

const {
  isCompletionDialog,
  confirmCompletionDialog,
  cancelCompletionDialog,
  complete,
  completeWithNote,
} = useTrackCompletion()

const {
  enrichedActivities,
  isEnrichedActivitiesLoading,
  isEnrichedActivitiesError,
  retryEnrichedActivities,
} = useEnrichedActivities()

const cardRefs = new Map<string, { play: () => void }>()

const handleAddCompletion = (activityId: string) =>
  complete(activityId, () => cardRefs.get(activityId)?.play())

const handleAddCompletionWithNote = (activityId: string) =>
  completeWithNote(activityId, () => cardRefs.get(activityId)?.play())
</script>

<template>
  <PageHeader>
    <h1 class="font-bold text-2xl">Activities</h1>
  </PageHeader>

  <PageContent>
    <div v-if="isEnrichedActivitiesLoading" class="flex flex-col gap-3">
      <ActivityCardSkeleton v-for="i in 4" :key="i" />
    </div>

    <ActivitiesError v-else-if="isEnrichedActivitiesError" @retry="retryEnrichedActivities" />

    <ActivitiesOnboarding v-else-if="enrichedActivities.length === 0" />

    <TransitionGroup v-else tag="div" name="activity-list" class="relative flex flex-col gap-3">
      <ActivityCard
        v-for="activity in enrichedActivities"
        :key="activity.title"
        :ref="
          (el) => {
            if (el) cardRefs.set(activity.id, el as any)
            else cardRefs.delete(activity.id)
          }
        "
        :activity="activity"
        @complete="handleAddCompletion(activity.id)"
        @complete:long-press="handleAddCompletionWithNote(activity.id)"
      />
    </TransitionGroup>
  </PageContent>

  <CompletionCreateDialog
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
