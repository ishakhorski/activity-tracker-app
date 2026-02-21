<script setup lang="ts">
import TallySvg from '@/assets/icons/tally.svg'
</script>

<template>
  <TallySvg class="tally-root" />
</template>

<style scoped>
/*
 * Each mark animates via stroke-dashoffset (pathLength="1" normalises to [0,1]).
 * Full cycle: 7 s  linear  infinite
 *
 * Percentages (÷ 7 s):
 *   mark 1  draws  0 % →  9 %          (0.00 – 0.63 s)
 *           pause  9 % → 13 %          (0.63 – 0.91 s)  ← next waits here
 *   mark 2  draws 13 % → 22 %          (0.91 – 1.54 s)
 *           pause 22 % → 26 %          (1.54 – 1.82 s)
 *   mark 3  draws 26 % → 35 %          (1.82 – 2.45 s)
 *           pause 35 % → 39 %          (2.45 – 2.73 s)
 *   mark 4  draws 39 % → 48 %          (2.73 – 3.36 s)
 *           pause 48 % → 52 %          (3.36 – 3.64 s)
 *   mark 5  draws 52 % → 65 %          (3.64 – 4.55 s, diagonal is longer)
 *   all hold      65 % → 78 %          (4.55 – 5.46 s)
 *   all erase     78 % → 89 %          (5.46 – 6.23 s)
 *   all hidden    89 % → 100 %         (6.23 – 7.00 s)
 *
 * Per-segment easing:
 *   draw phase  → ease-in-out  (natural pen stroke)
 *   hold phase  → linear       (no motion, timing irrelevant)
 *   erase phase → ease-in      (quick swipe away)
 */

/* ── default: all marks hidden ────────────────────── */
.tally-root :deep(path) {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}

/* ── keyframes ────────────────────────────────────── */
@keyframes tally-1 {
  0% {
    stroke-dashoffset: 1;
    animation-timing-function: ease-in-out;
  }
  9% {
    stroke-dashoffset: 0;
    animation-timing-function: linear;
  }
  78% {
    stroke-dashoffset: 0;
    animation-timing-function: ease-in;
  }
  89% {
    stroke-dashoffset: 1;
    animation-timing-function: linear;
  }
  100% {
    stroke-dashoffset: 1;
  }
}

@keyframes tally-2 {
  0%,
  13% {
    stroke-dashoffset: 1;
    animation-timing-function: ease-in-out;
  }
  22% {
    stroke-dashoffset: 0;
    animation-timing-function: linear;
  }
  78% {
    stroke-dashoffset: 0;
    animation-timing-function: ease-in;
  }
  89% {
    stroke-dashoffset: 1;
    animation-timing-function: linear;
  }
  100% {
    stroke-dashoffset: 1;
  }
}

@keyframes tally-3 {
  0%,
  26% {
    stroke-dashoffset: 1;
    animation-timing-function: ease-in-out;
  }
  35% {
    stroke-dashoffset: 0;
    animation-timing-function: linear;
  }
  78% {
    stroke-dashoffset: 0;
    animation-timing-function: ease-in;
  }
  89% {
    stroke-dashoffset: 1;
    animation-timing-function: linear;
  }
  100% {
    stroke-dashoffset: 1;
  }
}

@keyframes tally-4 {
  0%,
  39% {
    stroke-dashoffset: 1;
    animation-timing-function: ease-in-out;
  }
  48% {
    stroke-dashoffset: 0;
    animation-timing-function: linear;
  }
  78% {
    stroke-dashoffset: 0;
    animation-timing-function: ease-in;
  }
  89% {
    stroke-dashoffset: 1;
    animation-timing-function: linear;
  }
  100% {
    stroke-dashoffset: 1;
  }
}

@keyframes tally-5 {
  0%,
  52% {
    stroke-dashoffset: 1;
    animation-timing-function: ease-in-out;
  }
  65% {
    stroke-dashoffset: 0;
    animation-timing-function: linear;
  }
  78% {
    stroke-dashoffset: 0;
    animation-timing-function: ease-in;
  }
  89% {
    stroke-dashoffset: 1;
    animation-timing-function: linear;
  }
  100% {
    stroke-dashoffset: 1;
  }
}

/* ── apply animations ─────────────────────────────── */
.tally-root :deep(path:nth-child(1)) {
  animation: tally-1 7s linear infinite;
}
.tally-root :deep(path:nth-child(2)) {
  animation: tally-2 7s linear infinite;
}
.tally-root :deep(path:nth-child(3)) {
  animation: tally-3 7s linear infinite;
}
.tally-root :deep(path:nth-child(4)) {
  animation: tally-4 7s linear infinite;
}
.tally-root :deep(path:nth-child(5)) {
  animation: tally-5 7s linear infinite;
}

/* ── reduced motion: show all marks statically ────── */
@media (prefers-reduced-motion: reduce) {
  .tally-root :deep(path) {
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>
