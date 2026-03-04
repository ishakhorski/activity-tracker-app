<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useConfirmDialog } from '@vueuse/core'

import ActivityScheduleCard from '@/components/molecules/activity-details/ActivityScheduleCard.vue'
import ActivityScheduleCardSkeleton from '@/components/molecules/activity-details/ActivityScheduleCardSkeleton.vue'
import ActivityDescriptionCard from '@/components/molecules/ActivityDescriptionCard.vue'
import ActivityDescriptionCardSkeleton from '@/components/molecules/ActivityDescriptionCardSkeleton.vue'
import ActivityTrackButton from '@/components/molecules/ActivityTrackButton.vue'
import { BaseButton } from '@/components/atoms/button'
import IconArchive from '@/assets/icons/archive.svg?component'
import ActivityCalendar from '@/components/organisms/ActivityCalendar.vue'
import ActivityCompletionsDialog from '@/components/organisms/ActivityCompletionsDialog.vue'
import CompletionCreateDialog from '@/components/organisms/CompletionCreateDialog.vue'
import ActivityDeleteDialog from '@/components/organisms/ActivityDeleteDialog.vue'
import ActivityError from '@/components/molecules/activity-details/ActivityError.vue'

import { useCompletionsQuery } from '@/composables/queries/useCompletionsQuery'
import { useActivityUpdateMutation } from '@/composables/mutations/useActivityUpdateMutation'
import { useActivityDeleteMutation } from '@/composables/mutations/useActivityDeleteMutation'
import { useTrackCompletion } from '@/composables/useTrackCompletion'
import type { Activity } from '@/types/activity'
import { enrichActivity, getDayStatus, getTargetForDay, toLocalDateKey } from '@/utils/activities'

const props = defineProps<{
  id: string
  activity: Activity | undefined
  isLoading: boolean
  isError: boolean
}>()

const { activity, isLoading, isError } = toRefs(props)

const router = useRouter()

const { mutate: updateActivity } = useActivityUpdateMutation()
const { mutate: deleteActivity, isPending: isDeleting } = useActivityDeleteMutation()

const completionsTo = new Date().toISOString()

const { data: completions } = useCompletionsQuery(
  computed(() => props.activity?.createdAt ?? ''),
  completionsTo,
  { enabled: computed(() => !!props.activity) },
)

const enrichedActivity = computed(() =>
  props.activity && completions.value
    ? enrichActivity(props.activity, completions.value)
    : undefined,
)

const todayKey = toLocalDateKey(new Date())
const isCompleted = computed(() => {
  if (!enrichedActivity.value) return false
  const count = enrichedActivity.value.completionsByDate[todayKey]?.length ?? 0
  const target = getTargetForDay(enrichedActivity.value.schedule, new Date().getDay())
  return getDayStatus(count, target) === 'completed'
})

const {
  addCompletion,
  isCompletionDialog,
  confirmCompletionDialog,
  cancelCompletionDialog,
  complete,
  completeWithNote,
} = useTrackCompletion()

const trackBtn = ref<InstanceType<typeof ActivityTrackButton> | null>(null)

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
  const [y = 0, m = 1, d = 1] = date.split('-').map(Number)
  dayDialogDate.value = new Date(y, m - 1, d)
  const { data, isCanceled } = await revealDayDialog()
  if (isCanceled || !dayDialogDate.value) return
  const day = dayDialogDate.value
  const isToday = day.toDateString() === new Date().toDateString()
  const completedAt = isToday
    ? new Date().toISOString()
    : new Date(day.getFullYear(), day.getMonth(), day.getDate(), 12, 0, 0).toISOString()
  addCompletion({ activityId: props.id, completedAt, note: data?.note || null })
}

const handleComplete = () => complete(props.id, () => trackBtn.value?.play())
const handleCompleteLongPress = () => completeWithNote(props.id, () => trackBtn.value?.play())

const handleArchive = () =>
  updateActivity({ id: props.id, data: { archivedAt: new Date().toISOString() } })
const handleUnarchive = () => updateActivity({ id: props.id, data: { archivedAt: null } })

const {
  isRevealed: isDeleteDialog,
  reveal: revealDeleteDialog,
  confirm: confirmDeleteDialog,
  cancel: cancelDeleteDialog,
} = useConfirmDialog()

const handleDeleteClick = async () => {
  const { isCanceled } = await revealDeleteDialog()
  if (isCanceled) return
  deleteActivity(props.id)
  router.push({ name: 'activities-view' })
}
</script>

<template>
  <ActivityError v-if="isError" />

  <div v-else class="flex flex-col gap-3">
    <ActivityCalendar :activity="enrichedActivity" @click="openDayDialog" />

    <template v-if="isLoading">
      <ActivityScheduleCardSkeleton />
      <ActivityDescriptionCardSkeleton />
    </template>

    <template v-else-if="activity">
      <ActivityScheduleCard :schedule="activity.schedule" />
      <ActivityDescriptionCard :description="activity.description" />
    </template>
  </div>

  <div v-if="!isError" class="flex flex-col gap-2 mt-4">
    <Transition name="complete-btn">
      <div v-if="!activity?.archivedAt" class="overflow-hidden">
        <ActivityTrackButton
          ref="trackBtn"
          size="medium"
          class="w-full"
          :variant="isCompleted ? 'primary' : 'secondary'"
          :disabled="isLoading"
          @click="handleComplete"
          @click:long-press="handleCompleteLongPress"
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
          <span :key="activity?.archivedAt?.toString()" class="flex items-center gap-2">
            <IconArchive aria-hidden="true" />
            {{ activity?.archivedAt ? 'Unarchive' : 'Archive' }}
          </span>
        </Transition>
      </BaseButton>
      <p class="text-xs text-muted-foreground/50 text-center leading-snug px-2">
        Hidden from main list. Find it in
        <RouterLink
          :to="{ name: 'activities-archive' }"
          class="underline underline-offset-2 hover:text-muted-foreground"
          >Archive</RouterLink
        >.
      </p>
    </div>

    <BaseButton
      variant="secondary"
      class="w-full mt-6 text-destructive hover:bg-destructive/10 active:bg-destructive/15"
      :disabled="isLoading || isDeleting"
      @click="handleDeleteClick"
    >
      Delete
    </BaseButton>
  </div>

  <CompletionCreateDialog
    v-model:open="isCompletionDialog"
    @cancel="cancelCompletionDialog"
    @confirm="confirmCompletionDialog"
  />

  <ActivityCompletionsDialog
    v-model:open="isDayDialogOpen"
    :date="dayDialogDate"
    :completions="dayDialogCompletions"
    :can-complete="!activity?.archivedAt"
    @confirm="confirmDayDialog"
    @cancel="cancelDayDialog"
  />

  <ActivityDeleteDialog
    v-model:open="isDeleteDialog"
    @confirm="confirmDeleteDialog"
    @cancel="cancelDeleteDialog"
  />
</template>

<style scoped>
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
