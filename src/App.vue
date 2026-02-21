<script setup lang="ts">
import { type Component, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const layouts: Record<string, Component> = {
  auth: defineAsyncComponent(() => import('@/layouts/AuthLayout.vue')),
  default: defineAsyncComponent(() => import('@/layouts/DefaultLayout.vue')),
}
</script>

<template>
  <component :is="layouts[route.meta.layout as string] ?? layouts.default">
    <RouterView />
  </component>
</template>
