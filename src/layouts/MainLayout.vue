<script setup lang="ts">
import AppNavigationMenu from '@/components/organisms/AppNavigationMenu.vue'
import AppSettingsButton from '@/components/organisms/AppSettingsButton.vue'
</script>

<template>
  <div class="relative flex flex-col h-dvh overflow-hidden">
    <AppSettingsButton />

    <slot />

    <AppNavigationMenu class="nav-position fixed z-10 right-1/2 translate-x-1/2" />
  </div>
</template>
