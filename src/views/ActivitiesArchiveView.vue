<script setup lang="ts">
import { BaseButton } from '@/components/atoms/button'
import IconArrowRight from '@/assets/icons/arrow-right.svg?component'
import PageHeader from '@/components/molecules/PageHeader.vue'
import PageContent from '@/components/molecules/PageContent.vue'
import ArchivedActivityCard from '@/components/molecules/activities-archive-list/ArchivedActivityCard.vue'
import ArchivedActivityCardSkeleton from '@/components/molecules/activities-archive-list/ArchivedActivityCardSkeleton.vue'
import ActivitiesArchiveError from '@/components/molecules/activities-archive-list/ActivitiesArchiveError.vue'
import ActivitiesArchiveEmpty from '@/components/molecules/activities-archive-list/ActivitiesArchiveEmpty.vue'

import { useArchivedActivitiesQuery } from '@/composables/queries/useArchivedActivitiesQuery'

const { data: activities, isLoading, isError, refetch } = useArchivedActivitiesQuery()
</script>

<template>
  <PageHeader>
    <RouterLink v-slot="{ navigate }" :to="{ name: 'settings-view' }" custom>
      <BaseButton as="a" variant="secondary" size="small" class="w-fit" @click="navigate">
        <IconArrowRight class="rotate-180 size-3.5" aria-hidden="true" />
        Settings
      </BaseButton>
    </RouterLink>
    <h1 class="font-bold text-xl text-center">Archive</h1>
  </PageHeader>

  <PageContent>
    <div v-if="isLoading" class="flex flex-col gap-3">
      <ArchivedActivityCardSkeleton v-for="i in 4" :key="i" />
    </div>
    <ActivitiesArchiveError v-else-if="isError" @retry="refetch" />
    <ActivitiesArchiveEmpty v-else-if="!activities?.length" />
    <div v-else class="flex flex-col gap-3">
      <ArchivedActivityCard
        v-for="activity in activities"
        :key="activity.id"
        :activity="activity"
      />
    </div>
  </PageContent>
</template>
