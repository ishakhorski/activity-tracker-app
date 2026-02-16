<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: number;
    min?: number;
    max?: number;
    label?: string;
  }>(),
  {
    min: 1,
    max: undefined,
    label: undefined,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const canDecrement = computed(() => props.modelValue > props.min);
const canIncrement = computed(() => props.max === undefined || props.modelValue < props.max);

function decrement() {
  if (canDecrement.value) emit("update:modelValue", props.modelValue - 1);
}

function increment() {
  if (canIncrement.value) emit("update:modelValue", props.modelValue + 1);
}

function onInput(event: Event) {
  const value = parseInt((event.target as HTMLInputElement).value, 10);
  if (isNaN(value)) return;
  const clamped = Math.max(props.min, props.max !== undefined ? Math.min(value, props.max) : value);
  emit("update:modelValue", clamped);
}

function onBlur(event: FocusEvent) {
  const el = event.target as HTMLInputElement;
  el.value = String(props.modelValue);
}
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="inline-flex items-stretch glass rounded-full h-10">
      <button
        class="flex items-center justify-center w-10 shrink-0 rounded-l-full cursor-pointer transition-colors hover:bg-foreground/5 active:bg-foreground/10 disabled:opacity-40 disabled:pointer-events-none"
        :disabled="!canDecrement"
        @click="decrement"
      >
        <svg class="size-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="8" x2="13" y2="8" /></svg>
      </button>
      <input
        type="number"
        :value="modelValue"
        :min="min"
        :max="max"
        class="w-10 bg-transparent text-center text-sm font-semibold tabular-nums outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
        @input="onInput"
        @blur="onBlur"
      />
      <button
        class="flex items-center justify-center w-10 shrink-0 rounded-r-full cursor-pointer transition-colors hover:bg-foreground/5 active:bg-foreground/10 disabled:opacity-40 disabled:pointer-events-none"
        :disabled="!canIncrement"
        @click="increment"
      >
        <svg class="size-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="8" x2="13" y2="8" /><line x1="8" y1="3" x2="8" y2="13" /></svg>
      </button>
    </div>
    <span v-if="label" class="text-sm text-muted-foreground">
      {{ label }}
    </span>
  </div>
</template>
