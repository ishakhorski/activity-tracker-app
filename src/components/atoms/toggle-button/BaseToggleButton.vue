<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { twMerge } from "tailwind-merge";

import { toggleButtonVariation } from "./index";

const props = defineProps<{
  active?: boolean;
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <button :class="twMerge(toggleButtonVariation({ active: props.active ?? false }), props.class)">
    <slot />
  </button>
</template>
