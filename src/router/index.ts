import { createRouter, createWebHistory } from 'vue-router'

import { AUTH_ROLE, type AuthRole } from '@/types/auth'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: 'auth' | 'main' | 'secondary' | 'empty'
    roles?: AuthRole[]
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('@/views/auth/AuthLoginView.vue'),
      meta: { layout: 'auth', roles: [AUTH_ROLE.PUBLIC] },
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('@/views/auth/AuthCallbackView.vue'),
      meta: { layout: 'auth', roles: [AUTH_ROLE.PUBLIC] },
    },

    {
      path: '/',
      redirect: '/activities',
    },
    {
      path: '/activities',
      name: 'activities-view',
      component: () => import('@/views/activities/ActivitiesView.vue'),
      meta: { layout: 'main', roles: [AUTH_ROLE.USER] },
    },
    {
      path: '/activities/:type/:id',
      name: 'activity-details',
      component: () => import('@/views/activities/ActivityDetailsView.vue'),
      meta: { layout: 'secondary', roles: [AUTH_ROLE.USER] },
    },
    {
      path: '/stats',
      name: 'stats-view',
      component: () => import('@/views/StatsView.vue'),
      meta: { layout: 'main', roles: [AUTH_ROLE.USER] },
    },
    {
      path: '/settings',
      name: 'settings-view',
      component: () => import('@/views/SettingsView.vue'),
      meta: { layout: 'main', roles: [AUTH_ROLE.USER] },
    },
    {
      path: '/settings/archived',
      name: 'archived-view',
      component: () => import('@/views/activities/ArchivedActivitiesView.vue'),
      meta: { layout: 'secondary', roles: [AUTH_ROLE.USER] },
    },
  ],
})

export default router
