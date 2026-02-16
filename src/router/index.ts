import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/activities',
    },
    {
      path: '/activities',
      name: 'activities-view',
      component: () => import('@/views/ActivitiesView.vue'),
      meta: { layout: 'default' },
    },
    {
      path: '/stats',
      name: 'stats-view',
      component: () => import('@/views/StatsView.vue'),
      meta: { layout: 'default' },
    },
  ],
})

export default router
