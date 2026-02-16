<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { twMerge } from "tailwind-merge";

import { segmentedControlVariation } from "./index";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div :class="twMerge(segmentedControlVariation(), props.class)">
    <slot />
  </div>
</template>
