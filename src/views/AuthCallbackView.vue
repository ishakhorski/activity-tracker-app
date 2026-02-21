<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuth0 } from '@/plugins/auth0Plugin'

const route = useRoute()
const router = useRouter()
const { handleRedirectCallback } = useAuth0()

onMounted(async () => {
  const error = route.query.error as string | undefined

  if (error) {
    router.replace({
      name: 'login',
      query: { error, error_description: route.query.error_description },
    })
    return
  }

  try {
    await handleRedirectCallback()
    router.replace({ name: 'activities-view' })
  } catch (err) {
    router.replace({
      name: 'login',
      query: {
        error: 'callback_error',
        error_description:
          err instanceof Error ? err.message : 'An unexpected error occurred during sign-in.',
      },
    })
  }
})
</script>

<template>
  <div class="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
</template>
