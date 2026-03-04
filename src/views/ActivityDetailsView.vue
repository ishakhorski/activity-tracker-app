<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'

import { ACTIVITY_TYPE, type ActivityType } from '@/types/activityType'
import PageHeader from '@/components/molecules/PageHeader.vue'
import PageContent from '@/components/molecules/PageContent.vue'
import { BaseButton } from '@/components/atoms/button'
import IconArrowRight from '@/assets/icons/arrow-right.svg?component'
import IconArchive from '@/assets/icons/archive.svg?component'
import { useActivityQuery } from '@/composables/queries/useActivityQuery'

import PersonalActivityDetails from '@/components/organisms/PersonalActivityDetails.vue'
import GroupActivityDetails from '@/components/organisms/GroupActivityDetails.vue'

const DETAIL_COMPONENTS: Record<ActivityType, Component> = {
  [ACTIVITY_TYPE.PERSONAL]: PersonalActivityDetails,
  [ACTIVITY_TYPE.GROUP]: GroupActivityDetails,
}

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)
const type = computed(() => route.params.type as ActivityType)

const prevRoute = computed(() => {
  const back = (window.history.state?.back as string | undefined) ?? ''
  return back ? router.resolve(back) : null
})
const isFromArchive = computed(() => prevRoute.value?.name === 'activities-archive')
const backRoute = computed(() =>
  isFromArchive.value ? { name: 'activities-archive' } : { name: 'activities-view' },
)
const backLabel = computed(() => (isFromArchive.value ? 'Archive' : 'Activities'))

const { data: activity, isLoading, isError } = useActivityQuery(id)

const detailComponent = computed(() => DETAIL_COMPONENTS[type.value] ?? PersonalActivityDetails)
</script>

<template>
  <PageHeader>
    <RouterLink v-slot="{ navigate }" :to="backRoute" custom>
      <BaseButton as="a" variant="secondary" size="small" class="w-fit" @click="navigate">
        <IconArrowRight class="rotate-180 size-3.5" aria-hidden="true" />
        {{ backLabel }}
      </BaseButton>
    </RouterLink>

    <div class="flex items-center justify-center">
      <div v-if="activity" class="relative flex items-center">
        <h1 class="font-bold text-xl truncate text-center px-8">{{ activity.title }}</h1>
        <Transition name="archive-badge" appear>
          <IconArchive
            v-if="activity.archivedAt"
            class="absolute right-0 size-5 text-muted-foreground shrink-0"
            aria-label="Archived"
          />
        </Transition>
      </div>
      <div v-else-if="isLoading" class="h-7 w-40 rounded-lg bg-foreground/8 animate-pulse" />
    </div>
  </PageHeader>

  <PageContent>
    <component
      :is="detailComponent"
      :id="id"
      :activity="activity"
      :is-loading="isLoading"
      :is-error="isError"
    />
  </PageContent>
</template>

<style scoped>
.archive-badge-enter-active,
.archive-badge-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.archive-badge-enter-from,
.archive-badge-leave-to {
  opacity: 0;
  transform: scale(0.6) rotate(-15deg);
}
</style>
