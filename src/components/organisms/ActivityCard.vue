<script setup lang="ts">
import { computed, ref } from 'vue'

import { BaseButton } from '@/components/atoms/button'
import IconBolt from '@/assets/icons/bolt.svg'
import IconBoltFill from '@/assets/icons/bolt-fill.svg'

import type { Activity } from '@/types/activity'
import type { Completion } from '@/types/completion'
import { getTargetForDay as getTargetForDayFn } from '@/composables/useActivities'

const props = defineProps<{
  activity: Activity
  completions: Completion[]
}>()

const emit = defineEmits<{
  complete: [activityId: string, date: string]
  archive: [activityId: string]
  delete: [activityId: string]
}>()

// Swipe state
const startX = ref(0)
const currentX = ref(0)
const swiping = ref(false)
const swiped = ref(false)
const cardEl = ref<HTMLElement | null>(null)

const SWIPE_THRESHOLD = 60
const ACTIONS_WIDTH = 144

const revealedWidth = computed(() => {
  if (swiped.value && !swiping.value) return ACTIONS_WIDTH
  if (!swiping.value) return 0
  const diff = currentX.value - startX.value
  if (diff > 0) return swiped.value ? Math.max(0, ACTIONS_WIDTH - diff) : 0
  return swiped.value ? ACTIONS_WIDTH : Math.min(ACTIONS_WIDTH, -diff)
})

function onPointerDown(e: PointerEvent) {
  startX.value = e.clientX
  currentX.value = e.clientX
  swiping.value = true
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!swiping.value) return
  currentX.value = e.clientX
}

function onPointerUp() {
  if (!swiping.value) return
  swiping.value = false
  const diff = currentX.value - startX.value

  if (swiped.value) {
    if (diff > SWIPE_THRESHOLD) {
      swiped.value = false
    }
  } else {
    if (diff < -SWIPE_THRESHOLD) {
      swiped.value = true
    }
  }
}

function closeSwipe() {
  swiped.value = false
}

function handleArchive() {
  closeSwipe()
  emit('archive', props.activity.id)
}

function handleDelete() {
  closeSwipe()
  emit('delete', props.activity.id)
}

const last7Days = computed(() => {
  const days: {
    weekday: string
    date: number
    dayStart: Date
    count: number
    dayTarget: number
    isToday: boolean
    isScheduled: boolean
  }[] = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayEnd.getDate() + 1)

    const count = props.completions.filter((c) => {
      const t = new Date(c.completedAt)
      return t >= dayStart && t < dayEnd
    }).length

    const dayTarget = getTargetForDayFn(props.activity, dayStart.getDay())

    days.push({
      weekday: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
      date: dayStart.getDate(),
      dayStart,
      count,
      dayTarget,
      isToday: i === 0,
      isScheduled: dayTarget > 0,
    })
  }

  return days
})

const todayData = computed(() => last7Days.value[last7Days.value.length - 1])
const todayCount = computed(() => todayData.value?.count ?? 0)
const todayTarget = computed(() => todayData.value?.dayTarget ?? 0)

const targetMet = computed(() => todayTarget.value > 0 && todayCount.value >= todayTarget.value)
</script>

<template>
  <div class="flex rounded-2xl overflow-hidden">
    <!-- Card content -->
    <div
      ref="cardEl"
      class="shrink-0 w-full glass rounded-2xl px-3 py-4 flex items-center gap-3 touch-pan-y"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <h3 class="font-semibold text-sm truncate">{{ activity.title }}</h3>
          <span class="text-[11px] text-muted-foreground tabular-nums shrink-0">
            {{
              todayTarget > 0 ? `${todayCount}/${todayTarget}` : todayCount > 0 ? todayCount : ''
            }}
          </span>
        </div>

        <div class="flex items-end gap-1 mt-2">
          <div
            v-for="(day, index) in last7Days"
            :key="index"
            class="flex flex-col items-center gap-1"
          >
            <span
              class="text-[10px] leading-none"
              :class="day.isToday ? 'text-primary font-semibold' : 'text-muted-foreground'"
            >
              {{ day.weekday }}
            </span>
            <button
              class="relative w-7 h-7 rounded-md overflow-hidden cursor-pointer transition-transform active:scale-90"
              :class="day.isScheduled ? 'bg-foreground/5' : 'bg-foreground/[0.02]'"
              @click="emit('complete', activity.id, day.dayStart.toISOString())"
            >
              <div
                v-if="day.count > 0 && day.dayTarget > 0"
                class="absolute inset-x-0 bottom-0 rounded-md transition-all duration-300"
                :class="day.count >= day.dayTarget ? 'bg-primary/25' : 'bg-primary/12'"
                :style="{ height: `${Math.min((day.count / day.dayTarget) * 100, 100)}%` }"
              />
              <div
                v-else-if="day.count > 0 && day.dayTarget === 0"
                class="absolute inset-0 rounded-md bg-primary/8"
              />
              <span
                v-if="day.count > 0"
                class="relative z-1 flex items-center justify-center w-full h-full text-[10px] font-medium"
                :class="
                  !day.isScheduled
                    ? 'text-primary/40'
                    : day.count >= day.dayTarget
                      ? 'text-primary'
                      : 'text-primary/60'
                "
              >
                {{ day.count }}
              </span>
              <span
                v-else-if="day.isScheduled"
                class="relative z-1 flex items-center justify-center w-full h-full text-muted-foreground/30"
              >
                <IconBolt class="h-3 w-auto" />
              </span>
            </button>
            <span
              class="text-[10px] leading-none tabular-nums"
              :class="day.isToday ? 'text-primary font-semibold' : 'text-muted-foreground/60'"
            >
              {{ day.date }}
            </span>
          </div>
        </div>
      </div>

      <BaseButton
        size="large"
        :variant="targetMet ? 'primary' : 'secondary'"
        :class="targetMet ? 'text-red-500 bg-red-500/15 border-red-500/20 hover:bg-red-500/25' : ''"
        @click="emit('complete', activity.id, new Date().toISOString())"
      >
        <IconBoltFill v-if="targetMet" class="size-5" />
        <IconBolt v-else class="size-5" />
        <span class="sr-only">Complete {{ activity.title }}</span>
      </BaseButton>
    </div>

    <!-- Action buttons revealed on swipe -->
    <div
      class="shrink-0 flex items-stretch overflow-hidden"
      :class="swiping ? '' : 'transition-[width] duration-200'"
      :style="{ width: `${revealedWidth}px` }"
    >
      <button
        class="flex-1 flex items-center justify-center text-xs font-medium text-nowrap bg-amber-500/15 text-amber-600 active:bg-amber-500/25 cursor-pointer transition-colors"
        @click="handleArchive"
      >
        Archive
      </button>
      <button
        class="flex-1 flex items-center justify-center text-xs font-medium text-nowrap bg-red-500/15 text-red-500 active:bg-red-500/25 cursor-pointer transition-colors"
        @click="handleDelete"
      >
        Delete
      </button>
    </div>
  </div>
</template>
