<script setup lang="ts">
import { useConfirmDialog } from '@vueuse/core'

import ActivityCreateDialog from '@/components/organisms/ActivityCreateDialog.vue'
import IconBolt from '@/assets/icons/bolt.svg?component'
import IconChart from '@/assets/icons/chart.svg?component'
import IconPlus from '@/assets/icons/plus.svg?component'

import { useActivityCreateMutation } from '@/composables/mutations/useActivityCreateMutation'
import type { CreateActivity } from '@/types/activity'

const { mutate: createActivity } = useActivityCreateMutation()

const {
  isRevealed: isCreateActivityDialog,
  reveal: revealCreateActivityDialog,
  confirm: confirmCreateActivityDialog,
  cancel: cancelCreateActivityDialog,
} = useConfirmDialog<CreateActivity>()

const openCreateActivityDialog = async () => {
  const { data, isCanceled } = await revealCreateActivityDialog()
  if (isCanceled || !data) return
  createActivity(data)
}
</script>

<template>
  <nav
    aria-label="Main navigation"
    class="nav-position fixed z-10 right-1/2 translate-x-1/2 glass rounded-full p-1"
  >
    <div class="flex items-center">
      <RouterLink
        to="/activities"
        active-class="text-primary bg-primary/15 ring-1 ring-white/20"
        class="w-20 h-14 flex flex-col items-center justify-center rounded-full text-xs font-medium touch-manipulation transition-colors duration-150 active:bg-foreground/10"
      >
        <IconBolt class="size-6" />
        Activities
      </RouterLink>

      <button
        type="button"
        aria-label="Add Activity"
        class="mx-1 size-14 flex items-center justify-center rounded-full glass text-primary ring-1 ring-white/20 touch-manipulation transition-transform duration-150 active:scale-[0.92]"
        @click="openCreateActivityDialog"
      >
        <IconPlus class="size-6" />
      </button>

      <RouterLink
        to="/stats"
        active-class="text-primary bg-primary/15 ring-1 ring-white/20"
        class="w-20 h-14 flex flex-col items-center justify-center rounded-full text-xs font-medium touch-manipulation transition-colors duration-150 active:bg-foreground/10"
      >
        <IconChart class="size-6" />
        Statistics
      </RouterLink>
    </div>
  </nav>
  <ActivityCreateDialog
    v-model:open="isCreateActivityDialog"
    :confirm="confirmCreateActivityDialog"
    :cancel="cancelCreateActivityDialog"
  />
</template>

<style>
.nav-position {
  bottom: max(env(safe-area-inset-bottom, 0px), 1.5rem);
}
</style>
