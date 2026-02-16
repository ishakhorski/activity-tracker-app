<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouteQuery } from "@vueuse/router";

import { BaseButton } from "@/components/atoms/button";
import {
  BaseSegmentedControl,
  BaseSegmentedControlButton,
} from "@/components/atoms/segmented-control";
import { BaseToggleButton } from "@/components/atoms/toggle-button";
import CreateActivityDialog from "@/components/organisms/CreateActivityDialog.vue";
import ActivityCard from "@/components/organisms/ActivityCard.vue";

import IconPlus from "@/assets/icons/plus.svg";
import IconCalendar from "@/assets/icons/calendar.svg";
import IconList from "@/assets/icons/list.svg";
import IconCheckmarkStack from "@/assets/icons/checkmark-stack.svg";
import IconCheckmarkStackFill from "@/assets/icons/checkmark-stack-fill.svg";
import IconCloudBoltFill from "@/assets/icons/cloud-bolt-fill.svg";

import { useActivities, isScheduledToday } from "@/composables/useActivities";
import { useCompletions } from "@/composables/useCompletions";

const { sortedActivities, isTargetMet } = useActivities();
const { addCompletion, getCompletions } = useCompletions();

const isCreateDialogOpen = ref(false);

const showFilter = useRouteQuery<string>("show", "all");
const showTodayOnly = computed({
  get: () => showFilter.value === "today",
  set: (val: boolean) => (showFilter.value = val ? "today" : "all"),
});

const hideDoneQuery = useRouteQuery<string>("hideDone", "false");
const hideCompleted = computed({
  get: () => hideDoneQuery.value === "true",
  set: (val: boolean) => (hideDoneQuery.value = val ? "true" : "false"),
});

const filteredActivities = computed(() => {
  return sortedActivities.value.filter((activity) => {
    if (showTodayOnly.value && !isScheduledToday(activity)) return false;
    if (hideCompleted.value && isTargetMet(activity)) return false;
    return true;
  });
});
</script>

<template>
  <div class="relative flex flex-col h-dvh overflow-hidden">
    <header class="relative z-20 px-4 py-6 top-safe flex flex-col gap-3 shrink-0">
      <div class="flex items-center justify-between">
        <h1 class="font-bold text-2xl">Activities</h1>
        <BaseButton variant="secondary" @click="isCreateDialogOpen = true">
          <IconPlus class="size-6" />
          <span class="sr-only">Add Activity</span>
        </BaseButton>
      </div>

      <div class="flex items-center gap-2">
        <BaseSegmentedControl>
          <BaseSegmentedControlButton :active="!showTodayOnly" @click="showTodayOnly = false">
            <IconList class="size-4" />
            All
          </BaseSegmentedControlButton>
          <BaseSegmentedControlButton :active="showTodayOnly" @click="showTodayOnly = true">
            <IconCalendar class="size-4" />
            Today
          </BaseSegmentedControlButton>
        </BaseSegmentedControl>

        <BaseToggleButton :active="hideCompleted" @click="hideCompleted = !hideCompleted">
          <IconCheckmarkStackFill v-if="hideCompleted" class="size-4" />
          <IconCheckmarkStack v-else class="size-4" />
          Hide done
        </BaseToggleButton>
      </div>
    </header>

    <div class="relative flex-1 min-h-0">
      <div
        class="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-background to-transparent"
      />
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-background to-transparent"
      />

      <main class="h-full overflow-y-auto px-4 pt-4 pb-24">
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
            <IconPlus class="size-6" />
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
          />
        </TransitionGroup>
      </main>
    </div>
  </div>

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
