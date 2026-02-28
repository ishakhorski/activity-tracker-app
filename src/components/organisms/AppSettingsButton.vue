<script setup lang="ts">
import IconGear from '@/assets/icons/gear.svg?component'
</script>

<template>
  <RouterLink
    to="/settings"
    active-class="text-primary bg-primary/15 ring-1 ring-white/20"
    class="settings-position fixed z-30 rounded-full p-2.5 text-muted-foreground transition-colors duration-150"
    aria-label="Settings"
  >
    <IconGear class="size-6" />
  </RouterLink>
</template>

<style>
.settings-position {
  top: max(env(safe-area-inset-top, 0px), 1rem);
  right: 1rem;
}
</style>
