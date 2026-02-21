import { createRouter, createWebHistory } from 'vue-router'
// import { authGuard } from "@auth0/auth0-vue";

declare module 'vue-router' {
  interface RouteMeta {
    layout?: string
    public?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true, layout: 'auth' },
    },
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

// router.beforeEach((to) => {
//   if (to.meta.public) return true;
//   return authGuard(to);
// });

export default router
