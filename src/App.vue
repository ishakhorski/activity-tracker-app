<script setup lang="ts">
import { type Component, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const layouts: Record<string, Component> = {
  default: defineAsyncComponent(() => import('@/layouts/DefaultLayout.vue')),
}
</script>

<template>
  <component :is="layouts[route.meta.layout as string] ?? layouts.default">
    <RouterView />
  </component>
</template>
