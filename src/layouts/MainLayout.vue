<script setup lang="ts">
import AppNavigationMenu from '@/components/organisms/AppNavigationMenu.vue'
import CreateActivityDialog from '@/components/organisms/CreateActivityDialog.vue'
import { useCreateActivityDialog } from '@/composables/useCreateActivityDialog'

import IconGear from '@/assets/icons/gear.svg'

const { isCreateActivityDialogOpen } = useCreateActivityDialog()
</script>

<template>
  <div class="relative flex flex-col h-dvh overflow-hidden">
    <RouterLink
      to="/settings"
      exact-active-class="text-primary bg-primary/15 ring-1 ring-white/20"
      class="settings-position fixed z-30 rounded-full p-2.5 text-muted-foreground transition-colors duration-150"
      aria-label="Settings"
    >
      <IconGear class="size-6" />
    </RouterLink>

    <slot />

    <AppNavigationMenu class="nav-position fixed z-10 right-1/2 translate-x-1/2" />
    <CreateActivityDialog v-model:open="isCreateActivityDialogOpen" />
  </div>
</template>

<style>
.nav-position {
  bottom: max(env(safe-area-inset-bottom, 0px), 1.5rem);
}

.settings-position {
  top: max(env(safe-area-inset-top, 0px), 1rem);
  right: 1rem;
}
</style>
