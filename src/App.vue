<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue'
import { useRoute } from 'vue-router'

import { LAYOUT, type Layout } from '@/types/layout'

const route = useRoute()

const layout = computed<Layout>(() => {
  return route.meta.layout ?? LAYOUT.EMPTY
})

const layouts: Record<Layout, Component> = {
  [LAYOUT.MAIN]: defineAsyncComponent(() => import('@/layouts/MainLayout.vue')),
  [LAYOUT.SECONDARY]: defineAsyncComponent(() => import('@/layouts/SecondaryLayout.vue')),
  [LAYOUT.AUTH]: defineAsyncComponent(() => import('@/layouts/AuthLayout.vue')),
  [LAYOUT.EMPTY]: defineAsyncComponent(() => import('@/layouts/EmptyLayout.vue')),
}
</script>

<template>
  <component :is="layouts[layout]">
    <RouterView />
  </component>
</template>
