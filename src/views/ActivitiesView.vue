<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouteQuery } from "@vueuse/router";

import { BaseButton } from "@/components/atoms/button";
import {
  BaseSegmentedControl,
  BaseSegmentedControlButton,
} from "@/components/atoms/segmented-control";
import { BaseToggleButton } from "@/components/atoms/toggle-button";
import PageHeader from "@/components/molecules/PageHeader.vue";
import PageContent from "@/components/molecules/PageContent.vue";
import CreateActivityDialog from "@/components/organisms/CreateActivityDialog.vue";
import ActivityCard from "@/components/organisms/ActivityCard.vue";
import ActivityCardSkeleton from "@/components/organisms/ActivityCardSkeleton.vue";
import ActivitiesOnboarding from "@/components/organisms/ActivitiesOnboarding.vue";
import ActivitiesEmpty from "@/components/organisms/ActivitiesEmpty.vue";

import IconPlus from "@/assets/icons/plus.svg";
import IconCalendar from "@/assets/icons/calendar.svg";
import IconList from "@/assets/icons/list.svg";
import IconCheckmarkStack from "@/assets/icons/checkmark-stack.svg";
import IconCheckmarkStackFill from "@/assets/icons/checkmark-stack-fill.svg";

import {
  useActivitiesQuery,
  useActivityArchiveMutation,
  useActivityDeleteMutation,
} from "@/composables/useActivities";
import { isScheduledToday } from "@/utils/activities";
import { useCompletionsQuery, useCompletionCreateMutation } from "@/composables/useCompletions";
import { getCompletionsByActivity, getTodayCompletionCount } from "@/utils/completions";

const { data: activitiesData, isLoading: activitiesLoading } = useActivitiesQuery();
const { data: completionsData, isLoading: completionsLoading } = useCompletionsQuery();

const activities = computed(() => activitiesData.value ?? []);
const completions = computed(() => completionsData.value ?? []);

function getCompletions(activityId: string) {
  return getCompletionsByActivity(completions.value, activityId);
}

function getTodayCount(activityId: string) {
  return getTodayCompletionCount(completions.value, activityId);
}
const { addCompletion } = useCompletionCreateMutation();
const { archiveActivity } = useActivityArchiveMutation();
const { deleteActivity } = useActivityDeleteMutation();

const loading = computed(() => activitiesLoading.value || completionsLoading.value);

const isCreateDialogOpen = ref(false);

const showFilter = useRouteQuery<string>("show", "all");

const hideDoneQuery = useRouteQuery<string>("hideDone", "false");
const hideCompleted = computed({
  get: () => hideDoneQuery.value === "true",
  set: (val: boolean) => (hideDoneQuery.value = val ? "true" : "false"),
});

// --- Sorting & filtering ---

const activeActivities = computed(() => activities.value.filter((a) => !a.archivedAt));

function isTargetMet(activity: (typeof activities.value)[number]): boolean {
  const count = getTodayCount(activity.id);
  if (!isScheduledToday(activity)) return count > 0;
  return count >= activity.schedule.targetCompletions;
}

function getSortGroup(activity: (typeof activities.value)[number]): number {
  if (isTargetMet(activity)) return 2;
  if (!isScheduledToday(activity)) return 1;
  return 0;
}

const completedOrder = ref<Map<string, number>>(new Map());
let completedSeq = 0;

watch(
  () => activeActivities.value.map((a) => isTargetMet(a)),
  (curr, prev) => {
    activeActivities.value.forEach((a, i) => {
      const justCompleted = curr[i] && (!prev || !prev[i]);
      if (justCompleted && !completedOrder.value.has(a.id)) {
        completedOrder.value.set(a.id, completedSeq++);
      }
      if (!curr[i]) {
        completedOrder.value.delete(a.id);
      }
    });
  },
  { immediate: true },
);

const sortedActivities = computed(() => {
  return [...activeActivities.value].sort((a, b) => {
    const aGroup = getSortGroup(a);
    const bGroup = getSortGroup(b);
    if (aGroup !== bGroup) return aGroup - bGroup;
    if (aGroup === 2) {
      const aOrder = completedOrder.value.get(a.id) ?? 0;
      const bOrder = completedOrder.value.get(b.id) ?? 0;
      return bOrder - aOrder;
    }
    return 0;
  });
});

const filteredActivities = computed(() => {
  return sortedActivities.value.filter((activity) => {
    if (showFilter.value === "today" && !isScheduledToday(activity)) return false;
    if (hideCompleted.value && isTargetMet(activity)) return false;
    return true;
  });
});

function clearFilters() {
  showFilter.value = "all";
  hideCompleted.value = false;
}
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
    <ActivityCardSkeleton v-if="loading" :count="4" />

    <ActivitiesOnboarding
      v-else-if="sortedActivities.length === 0"
      @create="isCreateDialogOpen = true"
    />

    <ActivitiesEmpty v-else-if="filteredActivities.length === 0" @clear-filters="clearFilters" />

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
</style>
