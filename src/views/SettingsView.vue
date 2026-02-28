<script setup lang="ts">
import { RouterLink } from 'vue-router'

import PageHeader from '@/components/molecules/PageHeader.vue'
import PageContent from '@/components/molecules/PageContent.vue'
import {
  BaseSegmentedControl,
  BaseSegmentedControlButton,
} from '@/components/atoms/segmented-control'
import { BaseButton } from '@/components/atoms/button'
import IconSystem from '@/assets/icons/system.svg?component'
import IconSunFill from '@/assets/icons/sun-fill.svg?component'
import IconMoonFill from '@/assets/icons/moon-fill.svg?component'
import IconArchive from '@/assets/icons/archive.svg?component'
import IconArrowRight from '@/assets/icons/arrow-right.svg?component'

import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'

const { logout, isLogoutPending } = useAuth()
const { theme } = useTheme()
</script>

<template>
  <PageHeader>
    <h1 class="font-bold text-2xl">Settings</h1>
  </PageHeader>

  <PageContent>
    <div class="grid gap-3">
      <div class="glass rounded-2xl pl-4 pr-2 py-2 flex items-center justify-between gap-4">
        <label class="text-sm font-medium">Theme</label>
        <BaseSegmentedControl v-model="theme">
          <BaseSegmentedControlButton value="light" class="flex-col h-auto w-14 gap-0.5 py-2">
            <IconSunFill class="size-4" />
            <span class="text-[11px]">Light</span>
          </BaseSegmentedControlButton>

          <BaseSegmentedControlButton value="system" class="flex-col h-auto w-14 gap-0.5 py-2">
            <IconSystem class="size-4" />
            <span class="text-[11px]">System</span>
          </BaseSegmentedControlButton>

          <BaseSegmentedControlButton value="dark" class="flex-col h-auto w-14 gap-0.5 py-2">
            <IconMoonFill class="size-4" />
            <span class="text-[11px]">Dark</span>
          </BaseSegmentedControlButton>
        </BaseSegmentedControl>
      </div>

      <RouterLink
        :to="{ name: 'archived-view' }"
        class="glass rounded-2xl px-4 py-3 flex items-center justify-between gap-4 transition-colors active:bg-foreground/5"
      >
        <div class="flex items-center gap-3 text-sm font-medium">
          <IconArchive class="size-4 text-muted-foreground" aria-hidden="true" />
          Archive
        </div>
        <IconArrowRight class="size-4 text-muted-foreground/40" aria-hidden="true" />
      </RouterLink>

      <BaseButton variant="secondary" :disabled="isLogoutPending" class="mt-4" @click="logout">
        Sign out
      </BaseButton>
    </div>
  </PageContent>
</template>
