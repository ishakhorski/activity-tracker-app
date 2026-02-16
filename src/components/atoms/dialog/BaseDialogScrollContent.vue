<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { twMerge } from "tailwind-merge";

import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
  type DialogContentEmits,
  type DialogContentProps,
} from "reka-ui";

import IconClose from "@/assets/icons/close.svg";

import {
  baseDialogCloseButtonVariation,
  baseDialogScrollContentVariation,
  baseDialogScrollOverlayVariation,
} from "./index";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<
    DialogContentProps & { class?: HTMLAttributes["class"]; showCloseButton?: boolean }
  >(),
  {
    showCloseButton: true,
  },
);
const emits = defineEmits<DialogContentEmits>();

const delegatedProps = reactiveOmit(props, "class", "showCloseButton");

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DialogPortal>
    <DialogOverlay :class="baseDialogScrollOverlayVariation()">
      <DialogContent
        :class="twMerge(baseDialogScrollContentVariation(), props.class)"
        v-bind="{ ...$attrs, ...forwarded }"
        @pointer-down-outside="
          (event) => {
            const originalEvent = event.detail.originalEvent;
            const target = originalEvent.target as HTMLElement;
            if (
              originalEvent.offsetX > target.clientWidth ||
              originalEvent.offsetY > target.clientHeight
            ) {
              event.preventDefault();
            }
          }
        "
      >
        <slot />

        <DialogClose v-if="showCloseButton" :class="baseDialogCloseButtonVariation()">
          <IconClose class="size-5" />
          <span class="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </DialogOverlay>
  </DialogPortal>
</template>
