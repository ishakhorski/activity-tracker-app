<script setup lang="ts">
import { computed } from 'vue'

import { useActivityMembersQuery } from '@/composables/queries/useActivityMembersQuery'

const props = defineProps<{
  activityId: string
}>()

const activityId = computed(() => props.activityId)
const { data: members, isLoading } = useActivityMembersQuery(activityId)
</script>

<template>
  <div class="glass rounded-2xl px-4 py-3 flex flex-col gap-2">
    <span class="text-xs text-muted-foreground">Members</span>

    <template v-if="isLoading">
      <div v-for="i in 2" :key="i" class="h-5 rounded-md bg-foreground/8 animate-pulse" />
    </template>

    <template v-else-if="members?.length">
      <div
        v-for="member in members"
        :key="member.id"
        class="flex items-center justify-between gap-2"
      >
        <span class="text-sm font-medium truncate">{{ member.displayName }}</span>
        <span
          class="text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
          :class="
            member.role === 'owner'
              ? 'bg-primary/15 text-primary'
              : 'bg-foreground/8 text-muted-foreground'
          "
        >
          {{ member.role === 'owner' ? 'Owner' : 'Member' }}
        </span>
      </div>
    </template>

    <span v-else class="text-sm text-muted-foreground">No members</span>
  </div>
</template>
