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

import type { Completion } from '@/types/completion'

const props = defineProps<{
  date: Date | null
  completions: Completion[]
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
            class="flex items-start gap-3 rounded-xl bg-foreground/4 px-3 py-2.5"
          >
            <span class="text-xs text-muted-foreground tabular-nums pt-px shrink-0">
              {{
                new Date(completion.completedAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }}
            </span>
            <p v-if="completion.note" class="text-sm leading-relaxed">{{ completion.note }}</p>
            <p v-else class="text-sm text-muted-foreground/40 italic">No note</p>
          </div>
        </template>

        <p v-else class="text-sm text-muted-foreground text-center py-4">
          No completions on this day.
        </p>
      </div>

      <template v-if="canComplete">
        <div class="grid gap-2">
          <label for="day-note" class="text-sm font-medium">Note</label>
          <BaseTextarea id="day-note" v-model="note" rows="2" placeholder="e.g. Felt great today" />
        </div>
        <BaseButton variant="primary" class="w-full shrink-0" @click="handleConfirm">
          <IconBolt class="size-4" aria-hidden="true" />
          Complete
        </BaseButton>
      </template>
    </BaseDialogContent>
  </BaseDialog>
</template>
