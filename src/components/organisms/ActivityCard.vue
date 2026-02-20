<script setup lang="ts">
import { computed, ref } from 'vue'

import { BaseButton } from '@/components/atoms/button'
import IconBolt from '@/assets/icons/bolt.svg'
import IconBoltFill from '@/assets/icons/bolt-fill.svg'

import { getTargetForDay as getTargetForDayFn } from '@/utils/activities'

import type { Activity } from '@/types/activity'
import type { Completion } from '@/types/completion'

const props = defineProps<{
  activity: Activity
  completions: Completion[]
}>()

const emit = defineEmits<{
  complete: [activityId: string, date: string]
}>()

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

const trackAnimKey = ref(0)

function handleTrack() {
  trackAnimKey.value++
  emit('complete', props.activity.id, new Date().toISOString())
}
</script>

<template>
  <!-- Card content -->
  <div class="shrink-0 w-full glass rounded-2xl px-3 py-4 flex items-center gap-3 touch-pan-y">
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <h3 class="font-semibold text-sm truncate">{{ activity.title }}</h3>
        <span class="text-[11px] text-muted-foreground tabular-nums shrink-0">
          {{ todayTarget > 0 ? `${todayCount}/${todayTarget}` : todayCount > 0 ? todayCount : '' }}
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

    <div class="track-btn-wrap" :class="trackAnimKey > 0 ? 'is-animated' : ''" :key="trackAnimKey">
      <BaseButton
        size="large"
        :variant="targetMet ? 'primary' : 'secondary'"
        :class="targetMet ? 'text-red-500 bg-red-500/15 border-red-500/20 hover:bg-red-500/25' : ''"
        @click="handleTrack"
      >
        <IconBoltFill v-if="targetMet" class="size-5 bolt-icon" />
        <IconBolt v-else class="size-5 bolt-icon" />
        <span class="sr-only">Complete {{ activity.title }}</span>
      </BaseButton>
      <div v-if="trackAnimKey > 0" class="track-anim-layer" />
    </div>
  </div>
</template>

<style scoped>
@keyframes icon-shake {
  0%,
  100% {
    transform: rotate(0deg) translate(0, 0);
  }
  10% {
    transform: rotate(12deg) translate(1px, -1px);
  }
  20% {
    transform: rotate(-10deg) translate(-1.5px, 0.5px);
  }
  30% {
    transform: rotate(14deg) translate(1px, 0.5px);
  }
  40% {
    transform: rotate(-12deg) translate(-1px, -0.5px);
  }
  50% {
    transform: rotate(10deg) translate(0.5px, 1px);
  }
  60% {
    transform: rotate(-8deg) translate(-0.5px, -1px);
  }
  70% {
    transform: rotate(6deg) translate(1px, 0);
  }
  80% {
    transform: rotate(-4deg) translate(-0.5px, 0.5px);
  }
  90% {
    transform: rotate(2deg) translate(0, -0.5px);
  }
}

@keyframes glow-flash {
  0% {
    opacity: 0;
    transform: scale(0.6);
  }
  25% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.3);
  }
}

.track-btn-wrap {
  position: relative;
}

.track-anim-layer {
  position: absolute;
  inset: -12px;
  border-radius: 9999px;
  background: radial-gradient(circle, oklch(0.65 0.2 25 / 0.45) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  animation: glow-flash 0.5s ease-out forwards;
}

.track-btn-wrap :deep(.bolt-icon) {
  transform-origin: center center;
}

.track-btn-wrap.is-animated :deep(.bolt-icon) {
  animation: icon-shake 0.15s ease-in-out 3;
}
</style>
