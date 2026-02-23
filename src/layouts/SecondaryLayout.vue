<script setup lang="ts">
import AppNavigationMenu from '@/components/organisms/AppNavigationMenu.vue'
import CreateActivityDialog from '@/components/organisms/CreateActivityDialog.vue'
import { useCreateActivityDialog } from '@/composables/useCreateActivityDialog'

const { isCreateActivityDialogOpen } = useCreateActivityDialog()
</script>

<template>
  <div class="relative flex flex-col h-dvh overflow-hidden">
    <slot />

    <AppNavigationMenu class="nav-position fixed z-10 right-1/2 translate-x-1/2" />
    <CreateActivityDialog v-model:open="isCreateActivityDialogOpen" />
  </div>
</template>

<style>
.nav-position {
  bottom: max(env(safe-area-inset-bottom, 0px), 1.5rem);
}
</style>
