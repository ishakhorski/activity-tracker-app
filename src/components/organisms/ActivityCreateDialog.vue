<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  BaseDialog,
  BaseDialogContent,
  BaseDialogHeader,
  BaseDialogTitle,
  BaseDialogFooter,
} from '@/components/atoms/dialog'
import { BaseButton } from '@/components/atoms/button'
import { BaseInput } from '@/components/atoms/input'
import { BaseTextarea } from '@/components/atoms/textarea'
import {
  BaseNumberStepper,
  BaseNumberStepperDecreaseButton,
  BaseNumberStepperIncreaseButton,
  BaseNumberStepperInput,
} from '@/components/atoms/number-stepper'
import {
  BaseSegmentedControl,
  BaseSegmentedControlButton,
} from '@/components/atoms/segmented-control'

import IconBoltFill from '@/assets/icons/bolt-fill.svg?component'
import IconPerson from '@/assets/icons/person.svg?component'
import IconGroup from '@/assets/icons/group.svg?component'

import { ACTIVITY_SCHEDULE_TYPE, type ActivitySchedule } from '@/types/activitySchedule'
import { WEEKDAYS_ORDERED, WEEKDAY_LABELS, type Weekday } from '@/types/weekday'
import { ACTIVITY_TYPE } from '@/types/activityType'
import type { CreateActivity } from '@/types/activity'

const props = defineProps<{
  confirm: (data: CreateActivity) => void
  cancel: () => void
}>()

const open = defineModel<boolean>('open', { default: false })

const title = ref('')
const description = ref('')
const activityType = ref<string>(ACTIVITY_TYPE.PERSONAL)
const scheduleType = ref<string>(ACTIVITY_SCHEDULE_TYPE.DAILY)
const targetCompletions = ref(1)
const selectedDays = ref<Weekday[]>([...WEEKDAYS_ORDERED])

const scheduleOptions = [
  { value: ACTIVITY_SCHEDULE_TYPE.DAILY, label: 'Daily' },
  { value: ACTIVITY_SCHEDULE_TYPE.WEEKLY, label: 'Weekly' },
]

const targetLabel = computed(() =>
  targetCompletions.value === 1 ? 'time per day' : 'times per day',
)

const toggleDay = (day: Weekday) => {
  const index = selectedDays.value.indexOf(day)
  if (index >= 0 && selectedDays.value.length > 1) {
    selectedDays.value.splice(index, 1)
  } else if (index < 0) {
    selectedDays.value.push(day)
  }
}

const isDaySelected = (day: Weekday) => {
  return selectedDays.value.includes(day)
}

const resetForm = () => {
  title.value = ''
  description.value = ''
  activityType.value = ACTIVITY_TYPE.PERSONAL
  scheduleType.value = ACTIVITY_SCHEDULE_TYPE.DAILY
  targetCompletions.value = 1
  selectedDays.value = [...WEEKDAYS_ORDERED]
}

const handleConfirm = () => {
  if (!title.value.trim()) return

  const schedule: ActivitySchedule =
    scheduleType.value === ACTIVITY_SCHEDULE_TYPE.WEEKLY
      ? {
          type: ACTIVITY_SCHEDULE_TYPE.WEEKLY,
          days: [...selectedDays.value],
          targetCompletions: targetCompletions.value,
        }
      : { type: ACTIVITY_SCHEDULE_TYPE.DAILY, targetCompletions: targetCompletions.value }

  props.confirm({
    type: activityType.value as 'personal' | 'group',
    title: title.value.trim(),
    description: description.value.trim() || null,
    schedule,
  })
  resetForm()
  open.value = false
}

const handleCancel = () => {
  props.cancel()
  resetForm()
  open.value = false
}

const handleUpdate = (newOpen: boolean) => {
  if (!newOpen) handleCancel()
}
</script>

<template>
  <BaseDialog :open="open" @update:open="handleUpdate">
    <BaseDialogContent>
      <BaseDialogHeader>
        <BaseDialogTitle>Add Activity</BaseDialogTitle>
      </BaseDialogHeader>

      <div class="grid gap-4">
        <div class="grid gap-2">
          <label for="activity-title" class="text-sm font-medium">Title</label>
          <BaseInput
            id="activity-title"
            v-model="title"
            type="text"
            placeholder="e.g. Morning Run"
          />
        </div>

        <div class="grid gap-2">
          <label for="activity-description" class="text-sm font-medium">
            Description
            <span class="text-muted-foreground font-normal">(optional)</span>
          </label>
          <BaseTextarea
            id="activity-description"
            v-model="description"
            placeholder="e.g. 30 minutes at a steady pace"
            rows="3"
          />
        </div>

        <div class="grid gap-2">
          <label class="text-sm font-medium">Schedule</label>
          <div class="flex gap-2">
            <BaseButton
              v-for="option in scheduleOptions"
              :key="option.value"
              :variant="scheduleType === option.value ? 'primary' : 'secondary'"
              size="small"
              @click="scheduleType = option.value"
            >
              {{ option.label }}
            </BaseButton>
          </div>
        </div>

        <div class="rounded-xl border border-border/50 p-3 grid gap-3 transition-all duration-300">
          <Transition name="schedule-days" mode="out-in">
            <div v-if="scheduleType === ACTIVITY_SCHEDULE_TYPE.WEEKLY" class="grid gap-2">
              <label class="text-sm font-medium">Days</label>
              <div class="flex gap-1.5">
                <button
                  v-for="day in WEEKDAYS_ORDERED"
                  :key="day"
                  type="button"
                  :aria-pressed="isDaySelected(day)"
                  :aria-label="WEEKDAY_LABELS[day]"
                  class="flex flex-col items-center justify-center flex-1 aspect-square rounded-xl cursor-pointer transition-all active:scale-90 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  :class="
                    isDaySelected(day)
                      ? 'glass bg-primary/15 text-primary border-primary/20'
                      : 'glass text-muted-foreground/50'
                  "
                  @click="toggleDay(day)"
                >
                  <IconBoltFill v-if="isDaySelected(day)" class="size-3.5" />
                  <span
                    class="text-[10px] font-medium leading-none"
                    :class="isDaySelected(day) ? '' : 'mt-1'"
                  >
                    {{ WEEKDAY_LABELS[day] }}
                  </span>
                </button>
              </div>
            </div>
          </Transition>

          <div class="grid gap-2">
            <label class="text-sm font-medium">Goal</label>
            <div class="flex items-center gap-3">
              <BaseNumberStepper v-model="targetCompletions" :min="1">
                <BaseNumberStepperDecreaseButton />
                <BaseNumberStepperInput />
                <BaseNumberStepperIncreaseButton />
              </BaseNumberStepper>
              <span class="text-muted-foreground text-sm">{{ targetLabel }}</span>
            </div>
          </div>
        </div>

        <BaseSegmentedControl v-model="activityType" class="w-full">
          <BaseSegmentedControlButton :value="ACTIVITY_TYPE.PERSONAL" class="flex-1">
            <IconPerson />
            Personal
          </BaseSegmentedControlButton>
          <BaseSegmentedControlButton :value="ACTIVITY_TYPE.GROUP" class="flex-1">
            <IconGroup />
            Group
          </BaseSegmentedControlButton>
        </BaseSegmentedControl>

        <Transition name="group-hint">
          <div v-if="activityType === ACTIVITY_TYPE.GROUP" class="overflow-hidden">
            <p class="bg-primary/10 rounded-xl px-3 py-2.5 text-xs leading-relaxed text-primary/80">
              After creation you'll get a
              <span class="font-semibold text-primary">shareable link</span>
              others can use to join this activity.
            </p>
          </div>
        </Transition>
      </div>

      <BaseDialogFooter>
        <BaseButton variant="secondary" type="button" @click="handleCancel">Cancel</BaseButton>
        <BaseButton :disabled="!title.trim()" @click="handleConfirm">Save</BaseButton>
      </BaseDialogFooter>
    </BaseDialogContent>
  </BaseDialog>
</template>

<style scoped>
.schedule-days-enter-active {
  transition: all 0.3s ease;
}

.schedule-days-leave-active {
  transition: all 0.2s ease;
}

.schedule-days-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}

.schedule-days-enter-to {
  opacity: 1;
  max-height: 80px;
  transform: translateY(0);
}

.schedule-days-leave-from {
  opacity: 1;
  max-height: 80px;
  transform: translateY(0);
}

.schedule-days-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}

.group-hint-enter-active {
  transition: all 0.3s ease;
}

.group-hint-leave-active {
  transition: all 0.2s ease;
}

.group-hint-enter-from,
.group-hint-leave-to {
  opacity: 0;
  max-height: 0;
}

.group-hint-enter-to,
.group-hint-leave-from {
  opacity: 1;
  max-height: 80px;
}
</style>
