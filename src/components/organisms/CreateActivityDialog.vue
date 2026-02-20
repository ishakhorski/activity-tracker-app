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
import {
  BaseNumberStepper,
  BaseNumberStepperDecreaseButton,
  BaseNumberStepperIncreaseButton,
  BaseNumberStepperInput,
} from '@/components/atoms/number-stepper'

import IconBoltFill from '@/assets/icons/bolt-fill.svg'

import {
  ACTIVITY_SCHEDULE_TYPE,
  WEEKDAYS_ORDERED,
  WEEKDAY_LABELS,
  type Weekday,
  type ActivitySchedule,
} from '@/types/activitySchedule'
import { useActivityCreateMutation } from '@/composables/useActivities'

const { createActivity } = useActivityCreateMutation()

const open = defineModel<boolean>('open', { default: false })

const title = ref('')
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

function toggleDay(day: Weekday) {
  const index = selectedDays.value.indexOf(day)
  if (index >= 0 && selectedDays.value.length > 1) {
    selectedDays.value.splice(index, 1)
  } else if (index < 0) {
    selectedDays.value.push(day)
  }
}

function isDaySelected(day: Weekday) {
  return selectedDays.value.includes(day)
}

function resetForm() {
  title.value = ''
  scheduleType.value = ACTIVITY_SCHEDULE_TYPE.DAILY
  targetCompletions.value = 1
  selectedDays.value = [...WEEKDAYS_ORDERED]
}

function handleSave() {
  if (!title.value.trim()) return

  const schedule: ActivitySchedule =
    scheduleType.value === ACTIVITY_SCHEDULE_TYPE.WEEKLY
      ? {
          type: ACTIVITY_SCHEDULE_TYPE.WEEKLY,
          days: [...selectedDays.value],
          targetCompletions: targetCompletions.value,
        }
      : { type: ACTIVITY_SCHEDULE_TYPE.DAILY, targetCompletions: targetCompletions.value }

  createActivity({ title: title.value.trim(), schedule })
  resetForm()
  open.value = false
}
</script>

<template>
  <BaseDialog v-model:open="open">
    <BaseDialogContent>
      <BaseDialogHeader>
        <BaseDialogTitle>Add Activity</BaseDialogTitle>
      </BaseDialogHeader>

      <div class="grid gap-4">
        <div class="grid gap-2">
          <label for="activity-title" class="text-sm font-medium">Title</label>
          <input
            id="activity-title"
            v-model="title"
            type="text"
            placeholder="e.g. Morning Run"
            class="h-10 w-full rounded-lg border border-border bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-[3px] focus:ring-ring/50"
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
                  class="flex flex-col items-center justify-center flex-1 aspect-square rounded-xl cursor-pointer transition-all active:scale-90"
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
      </div>

      <BaseDialogFooter>
        <BaseButton :disabled="!title.trim()" @click="handleSave">Save</BaseButton>
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
</style>
