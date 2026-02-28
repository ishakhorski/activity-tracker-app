<script setup lang="ts">
import { computed } from 'vue'

import { useActivityMembersQuery } from '@/composables/queries/useActivityMembersQuery'

const props = defineProps<{
  activityId: string
}>()

const activityId = computed(() => props.activityId)
const { data: members, isLoading } = useActivityMembersQuery(activityId)

const initials = (name: string) => name.charAt(0).toUpperCase()
</script>

<template>
  <div class="flex flex-col gap-2">
    <template v-if="isLoading">
      <div v-for="i in 3" :key="i" class="glass rounded-2xl px-4 py-3 flex items-center gap-3">
        <div class="size-9 rounded-full bg-foreground/8 animate-pulse shrink-0" />
        <div class="h-4 w-28 rounded-full bg-foreground/8 animate-pulse flex-1" />
        <div class="h-5 w-14 rounded-full bg-foreground/8 animate-pulse" />
      </div>
    </template>

    <template v-else>
      <div
        v-for="member in members"
        :key="member.id"
        class="glass rounded-2xl px-4 py-3 flex items-center gap-3"
      >
        <div class="size-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <span class="text-sm font-semibold text-primary leading-none">
            {{ initials(member.displayName) }}
          </span>
        </div>
        <span class="flex-1 text-sm font-medium truncate">{{ member.displayName }}</span>
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

      <p v-if="!members?.length" class="text-sm text-muted-foreground text-center py-6">
        No members yet.
      </p>
    </template>
  </div>
</template>
