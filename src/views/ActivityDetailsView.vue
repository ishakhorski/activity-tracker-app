<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useConfirmDialog } from '@vueuse/core'

import PageHeader from '@/components/molecules/PageHeader.vue'
import PageContent from '@/components/molecules/PageContent.vue'
import { BaseButton } from '@/components/atoms/button'
import {
  BaseDialog,
  BaseDialogContent,
  BaseDialogHeader,
  BaseDialogTitle,
  BaseDialogDescription,
  BaseDialogFooter,
} from '@/components/atoms/dialog'
import IconArrowRight from '@/assets/icons/arrow-right.svg?component'
import IconArchive from '@/assets/icons/archive.svg?component'
import ActivityCalendar from '@/components/organisms/ActivityCalendar.vue'
import ActivityDayDialog from '@/components/organisms/ActivityDayDialog.vue'
import ActivityTrackButton from '@/components/molecules/ActivityTrackButton.vue'

import {
  useActivityQuery,
  useActivityUpdateMutation,
  useActivityDeleteMutation,
} from '@/composables/useActivities'
import {
  useActivityMonthCompletionsQuery,
  useCompletionCreateMutation,
} from '@/composables/useCompletions'
import { ACTIVITY_SCHEDULE_TYPE, WEEKDAY_LABELS, WEEKDAYS_ORDERED } from '@/types/activitySchedule'
import { enrichActivity, getDayStatus, getTargetForDay, toLocalDateKey } from '@/utils/activities'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)

const fromArchive = computed(() => route.query.from === 'archived')
const backRoute = computed(() =>
  fromArchive.value ? { name: 'archived-view' } : { name: 'activities-view' },
)
const backLabel = computed(() => (fromArchive.value ? 'Archive' : 'Activities'))

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

// --- Month navigation ---

const today = new Date()
const currentFrom = toLocalDateKey(new Date(today.getFullYear(), today.getMonth(), 1))

const viewFrom = ref(currentFrom)
const slideDirection = ref<'left' | 'right'>('left')

const viewYear = computed(() => parseInt(viewFrom.value.slice(0, 4)))
const viewMonth = computed(() => parseInt(viewFrom.value.slice(5, 7)) - 1)

const canGoPrev = computed(() => {
  if (!activity.value) return false
  const created = new Date(activity.value.createdAt)
  const createdFrom = toLocalDateKey(new Date(created.getFullYear(), created.getMonth(), 1))
  return viewFrom.value > createdFrom
})

const canGoNext = computed(() => viewFrom.value < currentFrom)

const isCurrentMonth = computed(() => viewFrom.value === currentFrom)

const goToToday = () => {
  slideDirection.value = viewFrom.value < currentFrom ? 'left' : 'right'
  viewFrom.value = currentFrom
}

const goToPrevMonth = () => {
  slideDirection.value = 'right'
  const date = new Date(viewYear.value, viewMonth.value - 1, 1)
  viewFrom.value = toLocalDateKey(date)
}

const goToNextMonth = () => {
  slideDirection.value = 'left'
  const date = new Date(viewYear.value, viewMonth.value + 1, 1)
  viewFrom.value = toLocalDateKey(date)
}

// --- Month completions ---

const { data: monthCompletions, isFetching: isCompletionsFetching } =
  useActivityMonthCompletionsQuery(id, viewYear, viewMonth)

const gridLoading = computed(
  () => isCompletionsFetching.value && monthCompletions.value === undefined,
)

const bricksLoading = computed(() => isLoading.value || gridLoading.value)

// --- Enriched activity ---

const enrichedActivity = computed(() =>
  activity.value ? enrichActivity(activity.value, monthCompletions.value ?? []) : null,
)

const todayKey = toLocalDateKey(new Date())
const isCompleted = computed(() => {
  if (!enrichedActivity.value) return false
  const count = enrichedActivity.value.completionsByDate[todayKey]?.length ?? 0
  const target = getTargetForDay(enrichedActivity.value.schedule, new Date().getDay())
  return getDayStatus(count, target) === 'completed'
})

const calendarSchedule = computed(
  () =>
    enrichedActivity.value?.schedule ?? {
      type: ACTIVITY_SCHEDULE_TYPE.DAILY,
      targetCompletions: 0,
    },
)

const calendarCompletionsByDate = computed(() => enrichedActivity.value?.completionsByDate ?? {})

// --- Day dialog ---

const { addCompletion } = useCompletionCreateMutation()

const dayDialogDate = ref<Date | null>(null)

const dayDialogCompletions = computed(() => {
  if (!dayDialogDate.value || !enrichedActivity.value) return []
  const key = toLocalDateKey(dayDialogDate.value)
  return [...(enrichedActivity.value.completionsByDate[key] ?? [])].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
  )
})

const {
  isRevealed: isDayDialogOpen,
  reveal: revealDayDialog,
  confirm: confirmDayDialog,
  cancel: cancelDayDialog,
} = useConfirmDialog<{ note: string }>()

const openDayDialog = async (date: string) => {
  const [y, m, d] = date.split('-').map(Number)
  dayDialogDate.value = new Date(y, m - 1, d)
  const { data, isCanceled } = await revealDayDialog()
  if (isCanceled || !dayDialogDate.value) return
  const day = dayDialogDate.value
  const isToday = day.toDateString() === new Date().toDateString()
  const completedAt = isToday
    ? new Date().toISOString()
    : new Date(day.getFullYear(), day.getMonth(), day.getDate(), 12, 0, 0).toISOString()
  addCompletion({ activityId: id.value, completedAt, note: data?.note || null })
}

const handleComplete = () => {
  addCompletion({ activityId: id.value, completedAt: new Date().toISOString(), note: null })
}

// --- Actions ---

const handleArchive = () => updateActivity(id.value, { archivedAt: new Date().toISOString() })
const handleUnarchive = () => updateActivity(id.value, { archivedAt: null })

const deleteDialogOpen = ref(false)

const handleDelete = async () => {
  deleteDialogOpen.value = false
  await deleteActivity(id.value)
  router.push(backRoute.value)
}
</script>

<template>
  <PageHeader>
    <RouterLink v-slot="{ navigate }" :to="backRoute" custom>
      <BaseButton as="a" variant="secondary" size="small" class="w-fit" @click="navigate">
        <IconArrowRight class="rotate-180 size-3.5" aria-hidden="true" />
        {{ backLabel }}
      </BaseButton>
    </RouterLink>

    <div class="flex items-center justify-center">
      <div v-if="activity" class="relative flex items-center">
        <h1 class="font-bold text-xl truncate text-center px-8">{{ activity.title }}</h1>
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
    <p v-if="isError" class="text-sm text-muted-foreground text-center py-8">Activity not found.</p>

    <div v-else class="flex flex-col gap-3">
      <ActivityCalendar
        :schedule="calendarSchedule"
        :completions-by-date="calendarCompletionsByDate"
        :from="viewFrom"
        :loading="bricksLoading"
        :can-go-prev="canGoPrev"
        :can-go-next="canGoNext"
        :is-current-month="isCurrentMonth"
        :slide-direction="slideDirection"
        @prev="goToPrevMonth"
        @next="goToNextMonth"
        @today="goToToday"
        @click="openDayDialog"
      />

      <template v-if="isLoading">
        <div class="glass rounded-2xl px-4 py-3 flex items-center justify-between gap-4">
          <div class="h-4 w-16 rounded-full bg-foreground/8 animate-pulse" />
          <div class="h-5 w-36 rounded-full bg-foreground/8 animate-pulse" />
        </div>
        <div class="glass rounded-2xl px-4 py-3 flex flex-col gap-1.5">
          <div class="h-4 w-20 rounded-full bg-foreground/8 animate-pulse" />
          <div class="h-5 w-3/4 rounded-full bg-foreground/8 animate-pulse" />
        </div>
      </template>

      <template v-else-if="activity">
        <div class="glass rounded-2xl px-4 py-3 flex items-center justify-between gap-4">
          <span class="text-xs text-muted-foreground shrink-0">Schedule</span>
          <span class="text-sm font-medium text-right truncate min-w-0">
            {{ activity.schedule.type === ACTIVITY_SCHEDULE_TYPE.DAILY ? 'Daily' : 'Weekly' }}
            · {{ scheduleLabel }}
          </span>
        </div>

        <div class="glass rounded-2xl px-4 py-3 flex flex-col gap-1.5">
          <span class="text-xs text-muted-foreground">Description</span>
          <p v-if="activity.description" class="text-sm">{{ activity.description }}</p>
          <p v-else class="text-sm text-muted-foreground/40 italic">No description</p>
        </div>
      </template>
    </div>

    <div v-if="!isError" class="flex flex-col gap-2 mt-4">
      <Transition name="complete-btn">
        <div v-if="!activity?.archivedAt" class="overflow-hidden">
          <ActivityTrackButton
            size="medium"
            class="w-full"
            :completed="isCompleted"
            :disabled="isLoading"
            @click="handleComplete"
            @click:long-press="handleComplete"
          >
            Complete
          </ActivityTrackButton>
        </div>
      </Transition>

      <div class="flex flex-col gap-1.5">
        <BaseButton
          variant="secondary"
          class="w-full overflow-hidden"
          :disabled="isLoading"
          @click="activity?.archivedAt ? handleUnarchive() : handleArchive()"
        >
          <Transition name="label-swap" mode="out-in">
            <span :key="activity?.archivedAt ? 'unarchive' : 'archive'">
              {{ activity?.archivedAt ? 'Unarchive' : 'Archive' }}
            </span>
          </Transition>
        </BaseButton>
        <p class="text-xs text-muted-foreground/50 text-center leading-snug px-2">
          Hidden from main list. Find it in
          <RouterLink
            :to="{ name: 'archived-view' }"
            class="underline underline-offset-2 hover:text-muted-foreground"
            >Archive</RouterLink
          >.
        </p>
      </div>

      <BaseButton
        variant="secondary"
        class="w-full mt-6 text-destructive hover:bg-destructive/10 active:bg-destructive/15"
        :disabled="isLoading || isDeleting"
        @click="deleteDialogOpen = true"
      >
        Delete
      </BaseButton>

      <BaseDialog v-model:open="deleteDialogOpen">
        <BaseDialogContent>
          <BaseDialogHeader>
            <BaseDialogTitle>Delete activity?</BaseDialogTitle>
            <BaseDialogDescription>
              This will permanently delete "{{ activity?.title }}" and all its completion history.
              This cannot be undone.
            </BaseDialogDescription>
          </BaseDialogHeader>
          <BaseDialogFooter>
            <BaseButton variant="secondary" @click="deleteDialogOpen = false">Cancel</BaseButton>
            <BaseButton
              variant="secondary"
              class="text-destructive hover:bg-destructive/10 active:bg-destructive/15"
              :disabled="isDeleting"
              @click="handleDelete"
            >
              Delete
            </BaseButton>
          </BaseDialogFooter>
        </BaseDialogContent>
      </BaseDialog>
    </div>
  </PageContent>

  <ActivityDayDialog
    v-model:open="isDayDialogOpen"
    :date="dayDialogDate"
    :completions="dayDialogCompletions"
    :can-complete="!activity?.archivedAt"
    :confirm="confirmDayDialog"
    :cancel="cancelDayDialog"
  />
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

.complete-btn-enter-active,
.complete-btn-leave-active {
  transition:
    max-height 0.25s ease,
    opacity 0.2s ease;
  overflow: hidden;
  max-height: 40px;
}
.complete-btn-enter-from,
.complete-btn-leave-to {
  max-height: 0;
  opacity: 0;
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
