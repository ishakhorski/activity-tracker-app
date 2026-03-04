<script setup lang="ts">
import { computed } from 'vue'

import type { ActivitySchedule } from '@/types/activitySchedule'
import { formatScheduleLabel } from '@/utils/activities'

const props = defineProps<{
  schedule: ActivitySchedule
}>()

const label = computed(() => formatScheduleLabel(props.schedule))
</script>

<template>
  <div class="glass rounded-2xl px-4 py-3 flex items-center justify-between gap-4">
    <span class="text-xs text-muted-foreground shrink-0">Schedule</span>
    <span class="text-sm font-medium text-right truncate min-w-0">
      {{ label }}
    </span>
  </div>
</template>
