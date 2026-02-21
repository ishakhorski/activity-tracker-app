<script setup lang="ts">
import IconBolt from "@/assets/icons/bolt.svg";
import IconChart from "@/assets/icons/chart.svg";
import IconPlus from "@/assets/icons/plus.svg";
import { useCreateActivityDialog } from "@/composables/useCreateActivityDialog";

const { openCreateActivityDialog } = useCreateActivityDialog();
</script>

<template>
  <nav aria-label="Main navigation" class="glass rounded-full p-1">
    <div class="flex items-center">
      <RouterLink
        to="/activities"
        exact-active-class="text-primary bg-primary/15 ring-1 ring-white/20"
        class="w-20 h-14 flex flex-col items-center justify-center rounded-full text-xs font-medium transition-colors duration-150"
      >
        <IconBolt class="size-6" />
        Activities
      </RouterLink>

      <button
        type="button"
        aria-label="Add Activity"
        class="mx-1 size-14 flex items-center justify-center rounded-full glass text-primary ring-1 ring-white/20 transition-transform duration-150 active:scale-90"
        @click="openCreateActivityDialog"
      >
        <IconPlus class="size-6" />
      </button>

      <RouterLink
        to="/stats"
        exact-active-class="text-primary bg-primary/15 ring-1 ring-white/20"
        class="w-20 h-14 flex flex-col items-center justify-center rounded-full text-xs font-medium transition-colors duration-150"
      >
        <IconChart class="size-6" />
        Statistics
      </RouterLink>
    </div>
  </nav>
</template>
