<script setup lang="ts">
import AppNavigationMenu from "@/components/organisms/AppNavigationMenu.vue";
</script>

<template>
  <div class="min-h-screen">
    <slot />
    <AppNavigationMenu class="fixed z-10 right-1/2 translate-x-1/2 bottom-safe" />
  </div>
</template>
