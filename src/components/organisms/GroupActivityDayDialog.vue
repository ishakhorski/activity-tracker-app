<script setup lang="ts">
import { ref, computed } from 'vue'

import {
  BaseDialog,
  BaseDialogContent,
  BaseDialogHeader,
  BaseDialogTitle,
} from '@/components/atoms/dialog'
import { BaseButton } from '@/components/atoms/button'
import { BaseTextarea } from '@/components/atoms/textarea'
import IconBolt from '@/assets/icons/bolt.svg?component'

import type { CompletionWithUser } from '@/types/completion'

const props = defineProps<{
  date: Date | null
  completions: CompletionWithUser[]
  canComplete: boolean
  confirm: (data: { note: string }) => void
  cancel: () => void
}>()

const open = defineModel<boolean>('open', { default: false })

const note = ref('')

const dateLabel = computed(
  () =>
    props.date?.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }) ?? '',
)

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

const initials = (name: string) => name.charAt(0).toUpperCase()

const handleConfirm = () => {
  props.confirm({ note: note.value.trim() })
  note.value = ''
  open.value = false
}

const handleUpdate = (newOpen: boolean) => {
  if (!newOpen) {
    props.cancel()
    note.value = ''
  }
}
</script>

<template>
  <BaseDialog :open="open" @update:open="handleUpdate">
    <BaseDialogContent class="flex flex-col overflow-hidden">
      <BaseDialogHeader>
        <BaseDialogTitle>{{ dateLabel }}</BaseDialogTitle>
      </BaseDialogHeader>

      <div class="overflow-y-auto min-h-0 flex-1 flex flex-col gap-2">
        <template v-if="completions.length > 0">
          <div
            v-for="completion in completions"
            :key="completion.id"
            class="flex items-center gap-3 rounded-xl bg-foreground/4 px-3 py-2.5"
          >
            <div
              class="size-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5"
            >
              <span class="text-xs font-semibold text-primary leading-none">
                {{ initials(completion.displayName) }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline justify-between gap-2">
                <span class="text-sm font-medium truncate">{{ completion.displayName }}</span>
                <span class="text-xs text-muted-foreground tabular-nums shrink-0">
                  {{ formatTime(completion.completedAt) }}
                </span>
              </div>
              <p
                v-if="completion.note"
                class="text-sm text-muted-foreground/70 mt-0.5 leading-snug"
              >
                {{ completion.note }}
              </p>
            </div>
          </div>
        </template>

        <p v-else class="text-sm text-muted-foreground text-center py-4">
          No completions on this day.
        </p>
      </div>

      <template v-if="canComplete">
        <div class="grid gap-2">
          <label for="group-day-note" class="text-sm font-medium">Note</label>
          <BaseTextarea
            id="group-day-note"
            v-model="note"
            rows="2"
            placeholder="e.g. Felt great today"
          />
        </div>
        <BaseButton variant="primary" class="w-full shrink-0" @click="handleConfirm">
          <IconBolt class="size-4" aria-hidden="true" />
          Complete
        </BaseButton>
      </template>
    </BaseDialogContent>
  </BaseDialog>
</template>
