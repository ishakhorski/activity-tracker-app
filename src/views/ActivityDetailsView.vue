<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'

import PageHeader from '@/components/molecules/PageHeader.vue'
import PageContent from '@/components/molecules/PageContent.vue'
import { BaseButton } from '@/components/atoms/button'
import IconArrowRight from '@/assets/icons/arrow-right.svg?component'
import IconArchive from '@/assets/icons/archive.svg?component'
import {
  useActivityQuery,
  useActivityUpdateMutation,
  useActivityDeleteMutation,
} from '@/composables/useActivities'
import { ACTIVITY_SCHEDULE_TYPE, WEEKDAY_LABELS, WEEKDAYS_ORDERED } from '@/types/activitySchedule'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)

const { data: activity, isLoading, isError } = useActivityQuery(id)
const { updateActivity } = useActivityUpdateMutation()
const { deleteActivity, isPending: isDeleting } = useActivityDeleteMutation()

const scheduleLabel = computed(() => {
  const schedule = activity.value?.schedule
  if (!schedule) return null

  if (schedule.type === ACTIVITY_SCHEDULE_TYPE.DAILY) {
    return `${schedule.targetCompletions}× per day`
  }

  const days = WEEKDAYS_ORDERED.filter((d) => schedule.days.includes(d))
    .map((d) => WEEKDAY_LABELS[d])
    .join(', ')

  return `${days} · ${schedule.targetCompletions}× per session`
})

const handleArchive = () => {
  updateActivity(id.value, { archivedAt: new Date().toISOString() })
}

const handleUnarchive = () => {
  updateActivity(id.value, { archivedAt: null })
}

const handleDelete = async () => {
  await deleteActivity(id.value)
  router.push({ name: 'activities-view' })
}
</script>

<template>
  <PageHeader>
    <BaseButton
      :as="RouterLink"
      :to="{ name: 'activities-view' }"
      variant="secondary"
      size="small"
      class="w-fit"
    >
      <IconArrowRight class="rotate-180 size-3.5" aria-hidden="true" />
      Activities
    </BaseButton>

    <div class="flex items-center justify-center">
      <div v-if="activity" class="relative flex items-center">
        <h1 class="font-bold text-xl truncate text-center px-8">
          {{ activity.title }}
        </h1>
        <Transition name="archive-badge" appear>
          <IconArchive
            v-if="activity.archivedAt"
            class="absolute right-0 size-5 text-muted-foreground shrink-0"
            aria-label="Archived"
          />
        </Transition>
      </div>
      <div v-else-if="isLoading" class="h-7 w-40 rounded-lg bg-foreground/8 animate-pulse" />
    </div>
  </PageHeader>

  <PageContent>
    <div v-if="isLoading" class="flex flex-col gap-3">
      <div class="glass rounded-2xl px-4 py-3 flex items-center justify-between gap-4">
        <div class="h-4 w-16 rounded-full bg-foreground/8 animate-pulse" />
        <div class="h-5 w-36 rounded-full bg-foreground/8 animate-pulse" />
      </div>
      <div class="glass rounded-2xl px-4 py-3 flex flex-col gap-1.5">
        <div class="h-4 w-20 rounded-full bg-foreground/8 animate-pulse" />
        <div class="h-5 w-3/4 rounded-full bg-foreground/8 animate-pulse" />
      </div>
      <div class="flex flex-col gap-2 mt-4">
        <div class="h-10 rounded-full bg-foreground/8 animate-pulse" />
        <div class="h-10 rounded-full bg-foreground/8 animate-pulse" />
      </div>
    </div>

    <p v-else-if="isError" class="text-sm text-muted-foreground text-center py-8">
      Activity not found.
    </p>

    <div v-else-if="activity" class="flex flex-col gap-3">
      <div class="glass rounded-2xl px-4 py-3 flex items-center justify-between gap-4">
        <span class="text-xs text-muted-foreground shrink-0">Schedule</span>
        <span class="text-sm font-medium text-right truncate min-w-0">
          {{ activity.schedule.type === ACTIVITY_SCHEDULE_TYPE.DAILY ? 'Daily' : 'Weekly' }}
          · {{ scheduleLabel }}
        </span>
      </div>

      <div class="glass rounded-2xl px-4 py-3 flex flex-col gap-1.5">
        <span class="text-xs text-muted-foreground">Description</span>
        <p v-if="activity.description" class="text-sm leading-relaxed">
          {{ activity.description }}
        </p>
        <p v-else class="text-sm text-muted-foreground/40 italic">No description</p>
      </div>

      <div class="flex flex-col gap-2 mt-4">
        <BaseButton
          variant="secondary"
          class="w-full overflow-hidden"
          @click="activity.archivedAt ? handleUnarchive() : handleArchive()"
        >
          <Transition name="label-swap" mode="out-in">
            <span :key="activity.archivedAt ? 'unarchive' : 'archive'">
              {{ activity.archivedAt ? 'Unarchive' : 'Archive' }}
            </span>
          </Transition>
        </BaseButton>

        <BaseButton
          variant="secondary"
          class="text-destructive hover:bg-destructive/10 active:bg-destructive/15"
          :disabled="isDeleting"
          @click="handleDelete"
        >
          Delete
        </BaseButton>
      </div>
    </div>
  </PageContent>
</template>

<style scoped>
.archive-badge-enter-active,
.archive-badge-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.archive-badge-enter-from,
.archive-badge-leave-to {
  opacity: 0;
  transform: scale(0.6) rotate(-15deg);
}

.label-swap-leave-active,
.label-swap-enter-active {
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
}
.label-swap-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.label-swap-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
</style>
