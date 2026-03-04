<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppLogo from '@/components/molecules/AppLogo.vue'

import { useAuth0 } from '@/plugins/auth0Plugin'

const route = useRoute()
const router = useRouter()
const { handleRedirectCallback } = useAuth0()

const errorQuery = route.query.error as string | undefined
const errorDescriptionQuery = route.query.error_description as string | undefined

onMounted(async () => {
  if (errorQuery) {
    router.replace({
      name: 'login',
      query: { error: errorQuery, error_description: errorDescriptionQuery },
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
  <AppLogo class="size-18" />
</template>
