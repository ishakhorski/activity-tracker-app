<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useConfirmDialog } from '@vueuse/core'

import PageHeader from '@/components/molecules/PageHeader.vue'
import PageContent from '@/components/molecules/PageContent.vue'
import ActivityCard from '@/components/organisms/ActivityCard.vue'
import ActivitiesSkeleton from '@/components/organisms/ActivitiesSkeleton.vue'
import ActivitiesOnboarding from '@/components/organisms/ActivitiesOnboarding.vue'
import CreateCompletionDialog from '@/components/organisms/CreateCompletionDialog.vue'

import { useActivitiesQuery } from '@/composables/useActivities'
import { isScheduledToday, isTargetMet } from '@/utils/activities'
import { useCompletionsQuery, useCompletionCreateMutation } from '@/composables/useCompletions'
import { getCompletionsByActivity, getTodayCompletionCount } from '@/utils/completions'
import { useCreateActivityDialog } from '@/composables/useCreateActivityDialog'

import type { CreateCompletion } from '@/types/completion'

const { openCreateActivityDialog } = useCreateActivityDialog()
const { addCompletion } = useCompletionCreateMutation()

const { data: activitiesData, isLoading: activitiesLoading } = useActivitiesQuery()
const { data: completionsData, isLoading: completionsLoading } = useCompletionsQuery()

const isLoading = computed(() => activitiesLoading.value || completionsLoading.value)

const activities = computed(() => activitiesData.value ?? [])
const completions = computed(() => completionsData.value ?? [])

const activeActivities = computed(() => activities.value.filter((a) => !a.archivedAt))
const activeActivityMeta = computed(() =>
  activeActivities.value.map((a) => {
    const count = getTodayCompletionCount(completions.value, a.id)
    const met = isTargetMet(a, count)
    const group = met ? 2 : !isScheduledToday(a) ? 1 : 0
    return { activity: a, met, group }
  }),
)

const completedOrder = ref<Map<string, number>>(new Map())
let completedSeq = 0

watch(
  () => activeActivityMeta.value.map((m) => m.met),
  (curr, prev) => {
    activeActivityMeta.value.forEach((m, i) => {
      const justCompleted = curr[i] && (!prev || !prev[i])
      if (justCompleted && !completedOrder.value.has(m.activity.id)) {
        completedOrder.value.set(m.activity.id, completedSeq++)
      }
      if (!curr[i]) {
        completedOrder.value.delete(m.activity.id)
      }
    })
  },
  { immediate: true },
)

const sortedActivities = computed(() =>
  [...activeActivityMeta.value]
    .sort((a, b) => {
      if (a.group !== b.group) return a.group - b.group
      if (a.group === 2) {
        return (
          (completedOrder.value.get(b.activity.id) ?? 0) -
          (completedOrder.value.get(a.activity.id) ?? 0)
        )
      }
      return 0
    })
    .map((m) => m.activity),
)

const handleAddCompletion = async (activityId: string) => {
  addCompletion({
    activityId: activityId,
    note: null,
    completedAt: new Date().toISOString(),
  })
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
    addCompletion({
      activityId: activityId,
      note: data.note,
      completedAt: new Date().toISOString(),
    })
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
      v-else-if="sortedActivities.length === 0"
      @create="openCreateActivityDialog"
    />

    <TransitionGroup v-else tag="div" name="activity-list" class="relative flex flex-col gap-3">
      <ActivityCard
        v-for="activity in sortedActivities"
        :key="activity.title"
        :activity="activity"
        :completions="getCompletionsByActivity(completions, activity.id)"
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
