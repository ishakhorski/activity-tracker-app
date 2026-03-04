<script setup lang="ts">
import * as d3 from 'd3'
import { computed, onUnmounted, ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { format } from 'date-fns'

import type { CompletionRateDataPoint } from '@/types/statistics'

const props = defineProps<{
  data: CompletionRateDataPoint[]
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

const tweenedRates = ref<number[]>([])
let rafId: number | null = null

const animateTo = (target: number[], from: number[]) => {
  if (rafId !== null) cancelAnimationFrame(rafId)
  const startTime = performance.now()
  const tick = (now: number) => {
    const t = easeOutCubic(Math.min((now - startTime) / DURATION, 1))
    tweenedRates.value = target.map((end, i) => (from[i] ?? 0) + (end - (from[i] ?? 0)) * t)
    if (t < 1) rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)
}

watch(
  () => props.data,
  (newData, oldData) => {
    const sameLength = oldData?.length === newData.length
    const from = sameLength ? tweenedRates.value : newData.map(() => 0)
    animateTo(
      newData.map((d) => d.rate),
      from,
    )
  },
  { immediate: true },
)

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
})

// --- Chart ---

const parsed = computed(() =>
  props.data.map((d, i) => ({ ...d, ts: new Date(d.date), rate: tweenedRates.value[i] ?? 0 })),
)

const xScale = computed(() => {
  if (!parsed.value.length || !innerWidth.value) return null
  return d3
    .scaleTime()
    .domain(d3.extent(parsed.value, (d) => d.ts) as [Date, Date])
    .range([0, innerWidth.value])
})

const yScale = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0])

const areaPath = computed(() => {
  const xs = xScale.value
  if (!xs || parsed.value.length < 2) return ''
  return (
    d3
      .area<(typeof parsed.value)[0]>()
      .x((d) => xs(d.ts))
      .y0(innerHeight)
      .y1((d) => yScale(d.rate))
      .curve(d3.curveCatmullRom.alpha(0.5))(parsed.value) ?? ''
  )
})

const linePath = computed(() => {
  const xs = xScale.value
  if (!xs || parsed.value.length < 2) return ''
  return (
    d3
      .line<(typeof parsed.value)[0]>()
      .x((d) => xs(d.ts))
      .y((d) => yScale(d.rate))
      .curve(d3.curveCatmullRom.alpha(0.5))(parsed.value) ?? ''
  )
})

const xTicks = computed(() => {
  const xs = xScale.value
  if (!xs) return []
  return xs.ticks(5).map((t) => ({ label: format(t, 'MMM d'), x: xs(t) }))
})

const yTicks = [0, 0.5, 1].map((v) => ({ label: `${v * 100}%`, y: yScale(v) }))
</script>

<template>
  <div ref="containerRef" class="w-full">
    <svg v-if="innerWidth > 0" :width="width" :height="HEIGHT">
      <defs>
        <linearGradient id="crg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :style="{ stopColor: 'var(--primary)', stopOpacity: 0.2 }" />
          <stop offset="100%" :style="{ stopColor: 'var(--primary)', stopOpacity: 0 }" />
        </linearGradient>
      </defs>

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

        <!-- Area fill -->
        <path :d="areaPath" fill="url(#crg)" />

        <!-- Line stroke -->
        <path
          :d="linePath"
          fill="none"
          stroke="var(--primary)"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
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
