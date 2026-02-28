<script setup lang="ts">
import * as d3 from 'd3'
import { computed, onUnmounted, ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { format } from 'date-fns'

import type { ThroughputDataPoint } from '@/types/statistics'

const props = defineProps<{
  data: ThroughputDataPoint[]
}>()

const containerRef = ref<HTMLDivElement>()
const { width } = useElementSize(containerRef)

const ML = 32
const MR = 8
const MT = 8
const MB = 28
const HEIGHT = 160
const DURATION = 600

const innerWidth = computed(() => Math.max((width.value || 0) - ML - MR, 0))
const innerHeight = HEIGHT - MT - MB

// --- Tween ---

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

const tweenedCounts = ref<number[]>([])
let rafId: number | null = null

const animateTo = (target: number[], from: number[]) => {
  if (rafId !== null) cancelAnimationFrame(rafId)
  const startTime = performance.now()
  const tick = (now: number) => {
    const t = easeOutCubic(Math.min((now - startTime) / DURATION, 1))
    tweenedCounts.value = target.map((end, i) => (from[i] ?? 0) + (end - (from[i] ?? 0)) * t)
    if (t < 1) rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)
}

watch(
  () => props.data,
  (newData, oldData) => {
    const sameLength = oldData?.length === newData.length
    const from = sameLength ? tweenedCounts.value : newData.map(() => 0)
    animateTo(
      newData.map((d) => d.completed),
      from,
    )
  },
  { immediate: true },
)

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
})

// --- Chart ---

const xScale = computed(() => {
  if (!props.data.length || !innerWidth.value) return null
  return d3
    .scaleBand()
    .domain(props.data.map((d) => d.date))
    .range([0, innerWidth.value])
    .padding(0.15)
})

const maxCount = computed(() => Math.max(1, ...props.data.map((d) => d.completed)))

const yScale = computed(() =>
  d3.scaleLinear().domain([0, maxCount.value]).range([innerHeight, 0]).nice(),
)

const barRects = computed(() => {
  const xs = xScale.value
  if (!xs) return []
  return props.data.map((d, i) => {
    const count = tweenedCounts.value[i] ?? 0
    const y = yScale.value(count)
    return {
      x: xs(d.date) ?? 0,
      y,
      width: xs.bandwidth(),
      height: Math.max(0, innerHeight - y),
      date: d.date,
    }
  })
})

const xTicks = computed(() => {
  const data = props.data
  const xs = xScale.value
  if (!data.length || !xs) return []
  const tickCount = Math.min(5, data.length)
  return Array.from({ length: tickCount }, (_, i) => {
    const index = Math.round((i * (data.length - 1)) / Math.max(1, tickCount - 1))
    const point = data[index]!
    const xPos = xs(point.date) ?? 0
    return { label: format(new Date(point.date), 'MMM d'), x: xPos + xs.bandwidth() / 2 }
  })
})

const yTicks = computed(() =>
  yScale.value.ticks(3).map((v) => ({ label: String(v), y: yScale.value(v) })),
)
</script>

<template>
  <div ref="containerRef" class="w-full">
    <svg v-if="innerWidth > 0" :width="width" :height="HEIGHT">
      <g :transform="`translate(${ML},${MT})`">
        <!-- Horizontal grid lines -->
        <line
          v-for="tick in yTicks"
          :key="tick.label"
          x1="0"
          :y1="tick.y"
          :x2="innerWidth"
          :y2="tick.y"
          stroke="var(--border)"
          stroke-width="1"
          stroke-dasharray="3 3"
        />

        <!-- Bars -->
        <rect
          v-for="bar in barRects"
          :key="bar.date"
          :x="bar.x"
          :y="bar.y"
          :width="bar.width"
          :height="bar.height"
          fill="var(--primary)"
          opacity="0.8"
          rx="1"
        />

        <!-- X axis labels -->
        <text
          v-for="tick in xTicks"
          :key="tick.label"
          :x="tick.x"
          :y="innerHeight + 18"
          text-anchor="middle"
          font-size="10"
          fill="var(--muted-foreground)"
        >
          {{ tick.label }}
        </text>

        <!-- Y axis labels -->
        <text
          v-for="tick in yTicks"
          :key="tick.label"
          x="-6"
          :y="tick.y"
          text-anchor="end"
          dominant-baseline="middle"
          font-size="10"
          fill="var(--muted-foreground)"
        >
          {{ tick.label }}
        </text>
      </g>
    </svg>
  </div>
</template>
