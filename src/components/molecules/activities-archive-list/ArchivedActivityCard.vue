<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { format } from 'date-fns'

import IconArrowRight from '@/assets/icons/arrow-right.svg?component'
import type { Activity } from '@/types/activity'
import { formatScheduleLabel } from '@/utils/activities'

const props = defineProps<{ activity: Activity }>()

const scheduleLabel = computed(() => formatScheduleLabel(props.activity.schedule))
const archivedAtLabel = computed(() =>
  props.activity.archivedAt ? format(new Date(props.activity.archivedAt), 'MMM d, yyyy') : '',
)
</script>

<template>
  <RouterLink
    :to="{ name: 'activity-details', params: { id: activity.id, type: activity.type } }"
    class="glass rounded-2xl px-4 py-3 flex items-center gap-4 transition-colors active:bg-foreground/5"
  >
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium truncate">{{ activity.title }}</p>
      <p class="text-xs text-muted-foreground mt-0.5 truncate">{{ scheduleLabel }}</p>
      <p class="text-xs text-muted-foreground/50 mt-0.5">Archived {{ archivedAtLabel }}</p>
    </div>
    <IconArrowRight class="size-4 text-muted-foreground/40 shrink-0" aria-hidden="true" />
  </RouterLink>
</template>
