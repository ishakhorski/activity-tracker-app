<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'

import PageHeader from '@/components/molecules/PageHeader.vue'
import PageContent from '@/components/molecules/PageContent.vue'
import { BaseButton } from '@/components/atoms/button'
import IconArrowRight from '@/assets/icons/arrow-right.svg?component'
import IconArchive from '@/assets/icons/archive.svg?component'
import IconBolt from '@/assets/icons/bolt.svg?component'
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
import { getTargetForDay } from '@/utils/activities'
import {
  BaseDialog,
  BaseDialogContent,
  BaseDialogHeader,
  BaseDialogTitle,
  BaseDialogDescription,
  BaseDialogFooter,
} from '@/components/atoms/dialog'
import NoteCompletionDialog from '@/components/organisms/NoteCompletionDialog.vue'

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
const currentYear = today.getFullYear()
const currentMonth = today.getMonth()

const viewYear = ref(currentYear)
const viewMonth = ref(currentMonth)
const slideDirection = ref<'left' | 'right'>('left')

const slideTransitionName = computed(() => `month-slide-${slideDirection.value}`)

const monthLabel = computed(() =>
  new Date(viewYear.value, viewMonth.value).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  }),
)

const canGoPrev = computed(() => {
  if (!activity.value) return false
  const created = new Date(activity.value.createdAt)
  return viewYear.value * 12 + viewMonth.value > created.getFullYear() * 12 + created.getMonth()
})

const canGoNext = computed(
  () => viewYear.value * 12 + viewMonth.value < currentYear * 12 + currentMonth,
)

const isCurrentMonth = computed(
  () => viewYear.value === currentYear && viewMonth.value === currentMonth,
)

const goToToday = () => {
  slideDirection.value =
    viewYear.value * 12 + viewMonth.value < currentYear * 12 + currentMonth ? 'left' : 'right'
  viewYear.value = currentYear
  viewMonth.value = currentMonth
}

const goToPrevMonth = () => {
  slideDirection.value = 'right'
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value--
  } else {
    viewMonth.value--
  }
}

const goToNextMonth = () => {
  slideDirection.value = 'left'
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value++
  } else {
    viewMonth.value++
  }
}

// --- Month completions ---

const { data: monthCompletions, isFetching: isCompletionsFetching } =
  useActivityMonthCompletionsQuery(id, viewYear, viewMonth)

// Show skeleton only when there is no data yet (uncached month), not on background refetches
const gridLoading = computed(
  () => isCompletionsFetching.value && monthCompletions.value === undefined,
)

// Bricks show skeleton while either the activity or its completions are loading
const bricksLoading = computed(() => isLoading.value || gridLoading.value)

// Drive the staggered reveal: true for ~1.2s after loading clears
const isRevealing = ref(false)
let revealTimer: ReturnType<typeof setTimeout> | null = null
watch(bricksLoading, (nowLoading) => {
  if (revealTimer) clearTimeout(revealTimer)
  if (!nowLoading) {
    isRevealing.value = true
    revealTimer = setTimeout(() => {
      isRevealing.value = false
    }, 1200)
  } else {
    isRevealing.value = false
  }
})

// --- Brick grid ---

const weekHeaders = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

// Monday-first offset: Sun(0)→6, Mon(1)→0, Tue(2)→1, ...
const firstDayOffset = computed(
  () => (new Date(viewYear.value, viewMonth.value, 1).getDay() + 6) % 7,
)

const daysInMonth = computed(() => new Date(viewYear.value, viewMonth.value + 1, 0).getDate())

const todayTimestamp = new Date(currentYear, currentMonth, today.getDate()).getTime()

const dayBricks = computed(() => {
  const completions = monthCompletions.value ?? []
  const act = activity.value

  return Array.from({ length: daysInMonth.value }, (_, i) => {
    const day = i + 1
    const dayStart = new Date(viewYear.value, viewMonth.value, day)
    const dayEnd = new Date(viewYear.value, viewMonth.value, day + 1)

    const count = completions.filter((c) => {
      const t = new Date(c.completedAt)
      return t >= dayStart && t < dayEnd
    }).length

    const target = act ? getTargetForDay(act, dayStart.getDay()) : 0
    const isToday = dayStart.getTime() === todayTimestamp
    const isFuture = dayStart.getTime() > todayTimestamp

    return { day, count, target, isToday, isFuture }
  })
})

// --- Day completions dialog ---

const { addCompletion } = useCompletionCreateMutation()

const dayDialogOpen = ref(false)
const dayDialogDate = ref<Date | null>(null)
const noteDialogOpen = ref(false)

const dayDialogLabel = computed(
  () =>
    dayDialogDate.value?.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }) ?? '',
)

const dayDialogCompletions = computed(() => {
  if (!dayDialogDate.value) return []
  const dayStart = dayDialogDate.value
  const dayEnd = new Date(dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate() + 1)
  return (monthCompletions.value ?? [])
    .filter((c) => {
      const t = new Date(c.completedAt)
      return t >= dayStart && t < dayEnd
    })
    .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
})

const openDayDialog = (brick: (typeof dayBricks.value)[number]) => {
  if (bricksLoading.value || brick.isFuture) return
  dayDialogDate.value = new Date(viewYear.value, viewMonth.value, brick.day)
  dayDialogOpen.value = true
}

const handleNoteConfirm = (note: string) => {
  if (!dayDialogDate.value) return
  const d = dayDialogDate.value
  const isToday = d.toDateString() === new Date().toDateString()
  const completedAt = isToday
    ? new Date().toISOString()
    : new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0).toISOString()
  addCompletion({ activityId: id.value, completedAt, note: note || null })
}

const handleComplete = () => {
  addCompletion({
    activityId: id.value,
    completedAt: new Date().toISOString(),
    note: null,
  })
}

// --- Actions ---

const handleArchive = () => {
  updateActivity(id.value, { archivedAt: new Date().toISOString() })
}

const handleUnarchive = () => {
  updateActivity(id.value, { archivedAt: null })
}

const deleteDialogOpen = ref(false)

const handleDelete = async () => {
  deleteDialogOpen.value = false
  await deleteActivity(id.value)
  router.push(backRoute.value)
}
</script>

<template>
  <PageHeader>
    <BaseButton :as="RouterLink" :to="backRoute" variant="secondary" size="small" class="w-fit">
      <IconArrowRight class="rotate-180 size-3.5" aria-hidden="true" />
      {{ backLabel }}
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
    <p v-if="isError" class="text-sm text-muted-foreground text-center py-8">Activity not found.</p>

    <div v-else class="flex flex-col gap-3">
      <!-- Calendar card — always shown -->
      <div class="glass rounded-2xl px-4 py-3 flex flex-col gap-3">
        <!-- Month navigation -->
        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <BaseButton
            variant="secondary"
            size="medium"
            class="w-fit"
            :disabled="!canGoPrev"
            @click="goToPrevMonth"
          >
            <IconArrowRight class="rotate-180 size-4" aria-hidden="true" />
          </BaseButton>
          <span class="text-sm font-medium text-center tabular-nums">{{ monthLabel }}</span>
          <div class="flex items-center gap-1 justify-end">
            <BaseButton
              :variant="isCurrentMonth ? 'primary' : 'secondary'"
              size="small"
              @click="goToToday"
            >
              Today
            </BaseButton>
            <BaseButton
              variant="secondary"
              size="medium"
              :disabled="!canGoNext"
              @click="goToNextMonth"
            >
              <IconArrowRight class="size-4" aria-hidden="true" />
            </BaseButton>
          </div>
        </div>

        <!-- Animated grid -->
        <div class="overflow-hidden">
          <Transition :name="slideTransitionName" mode="out-in">
            <div :key="`${viewYear}-${viewMonth}`" class="flex flex-col gap-1">
              <!-- Weekday headers — always real -->
              <div class="grid grid-cols-7 gap-1">
                <span
                  v-for="(label, i) in weekHeaders"
                  :key="i"
                  class="text-center text-[10px] text-muted-foreground leading-none"
                >
                  {{ label }}
                </span>
              </div>

              <!-- Day bricks — skeleton while loading, real once ready -->
              <div class="grid grid-cols-7 gap-1">
                <template v-if="bricksLoading">
                  <div
                    v-for="i in 35"
                    :key="i"
                    class="aspect-square rounded-md bg-foreground/8 animate-pulse"
                  />
                </template>
                <template v-else>
                  <div v-for="i in firstDayOffset" :key="`offset-${i}`" class="aspect-square" />

                  <button
                    v-for="brick in dayBricks"
                    :key="brick.day"
                    class="relative aspect-square rounded-md overflow-hidden brick-cell active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    :class="[
                      brick.isFuture
                        ? brick.target > 0
                          ? 'bg-foreground/5 cursor-default'
                          : 'bg-foreground/[0.02] cursor-default'
                        : brick.target > 0
                          ? 'bg-foreground/5 cursor-pointer'
                          : 'bg-foreground/[0.02] cursor-pointer',
                      brick.isFuture ? 'opacity-30' : '',
                      brick.isToday ? 'ring-1 ring-inset ring-primary/50' : '',
                    ]"
                    :style="
                      isRevealing
                        ? { '--brick-delay': `${(firstDayOffset + brick.day - 1) * 22}ms` }
                        : undefined
                    "
                    :disabled="brick.isFuture"
                    @click="openDayDialog(brick)"
                  >
                    <!-- Fill layer — grows up from bottom on reveal -->
                    <Transition name="brick-fill">
                      <div
                        v-if="brick.count > 0 && brick.target > 0"
                        class="absolute inset-x-0 bottom-0"
                        :class="brick.count >= brick.target ? 'bg-primary/25' : 'bg-primary/12'"
                        :style="{ height: `${Math.min((brick.count / brick.target) * 100, 100)}%` }"
                      />
                    </Transition>
                    <Transition name="brick-fill">
                      <div
                        v-if="brick.count > 0 && brick.target === 0"
                        class="absolute inset-0 bg-primary/8"
                      />
                    </Transition>

                    <!-- Day number -->
                    <span
                      class="absolute inset-0 flex items-center justify-center text-[9px] leading-none z-1 brick-label"
                      :class="[
                        brick.isToday ? 'font-bold' : '',
                        brick.count > 0 && brick.target > 0 && brick.count >= brick.target
                          ? 'text-primary'
                          : brick.count > 0 && brick.target > 0
                            ? 'text-primary/75'
                            : brick.count > 0
                              ? 'text-muted-foreground'
                              : brick.isToday
                                ? 'text-foreground/60'
                                : 'text-muted-foreground/40',
                      ]"
                    >
                      {{ brick.day }}
                    </span>
                  </button>
                </template>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Schedule and description — skeleton or real -->
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
          <p v-if="activity.description" class="text-sm leading-relaxed">
            {{ activity.description }}
          </p>
          <p v-else class="text-sm text-muted-foreground/40 italic">No description</p>
        </div>

        <!-- Day completions dialog -->
        <BaseDialog v-model:open="dayDialogOpen">
          <BaseDialogContent class="flex flex-col overflow-hidden">
            <BaseDialogHeader>
              <BaseDialogTitle>{{ dayDialogLabel }}</BaseDialogTitle>
            </BaseDialogHeader>

            <div class="overflow-y-auto min-h-0 flex-1 flex flex-col gap-2">
              <template v-if="dayDialogCompletions.length > 0">
                <div
                  v-for="completion in dayDialogCompletions"
                  :key="completion.id"
                  class="flex items-start gap-3 rounded-xl bg-foreground/4 px-3 py-2.5"
                >
                  <span class="text-xs text-muted-foreground tabular-nums pt-px shrink-0">
                    {{
                      new Date(completion.completedAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    }}
                  </span>
                  <p v-if="completion.note" class="text-sm leading-relaxed">
                    {{ completion.note }}
                  </p>
                  <p v-else class="text-sm text-muted-foreground/40 italic">No note</p>
                </div>
              </template>

              <p v-else class="text-sm text-muted-foreground text-center py-4">
                No completions on this day.
              </p>
            </div>

            <BaseButton
              v-if="!activity?.archivedAt"
              variant="primary"
              class="w-full shrink-0"
              @click="noteDialogOpen = true"
            >
              <IconBolt class="size-4" aria-hidden="true" />
              Complete
            </BaseButton>
          </BaseDialogContent>
        </BaseDialog>

        <NoteCompletionDialog v-model:open="noteDialogOpen" @confirm="handleNoteConfirm" />
      </template>
    </div>

    <!-- Action buttons — always visible, disabled while loading -->
    <div v-if="!isError" class="flex flex-col gap-2 mt-4">
      <Transition name="complete-btn">
        <div v-if="!activity?.archivedAt" class="overflow-hidden">
          <BaseButton
            variant="primary"
            class="w-full"
            :disabled="isLoading"
            @click="handleComplete"
          >
            <IconBolt class="size-4" aria-hidden="true" />
            Complete
          </BaseButton>
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
</template>

<style scoped>
/* Brick reveal transitions — driven by --brick-delay CSS var set inline during isRevealing */
.brick-cell {
  transition:
    background-color 0.35s ease var(--brick-delay, 0ms),
    transform 0.12s ease;
}

.brick-label {
  transition:
    color 0.35s ease var(--brick-delay, 0ms),
    background-color 0.35s ease var(--brick-delay, 0ms);
}

/* Fill grows up from the bottom */
.brick-fill-enter-active {
  transition:
    opacity 0.3s ease var(--brick-delay, 0ms),
    transform 0.35s ease var(--brick-delay, 0ms);
  transform-origin: bottom;
}
.brick-fill-enter-from {
  opacity: 0;
  transform: scaleY(0.4);
}

/* Month slide animations */
.month-slide-left-enter-active,
.month-slide-left-leave-active,
.month-slide-right-enter-active,
.month-slide-right-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.month-slide-left-enter-from {
  opacity: 0;
  transform: translateX(32px);
}
.month-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-32px);
}

.month-slide-right-enter-from {
  opacity: 0;
  transform: translateX(-32px);
}
.month-slide-right-leave-to {
  opacity: 0;
  transform: translateX(32px);
}

/* Archive badge */
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

/* Complete button collapse */
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

/* Label swap */
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
