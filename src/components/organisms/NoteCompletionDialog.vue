<script setup lang="ts">
import { ref } from 'vue'

import {
  BaseDialog,
  BaseDialogContent,
  BaseDialogHeader,
  BaseDialogTitle,
  BaseDialogDescription,
  BaseDialogFooter,
} from '@/components/atoms/dialog'
import { BaseButton } from '@/components/atoms/button'
import { BaseTextarea } from '@/components/atoms/textarea'

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  confirm: [note: string]
}>()

const note = ref('')

function handleConfirm() {
  emit('confirm', note.value.trim())
  note.value = ''
  open.value = false
}

function handleCancel() {
  note.value = ''
  open.value = false
}
</script>

<template>
  <BaseDialog v-model:open="open">
    <BaseDialogContent :show-close-button="false">
      <BaseDialogHeader>
        <BaseDialogTitle>Add a note</BaseDialogTitle>
        <BaseDialogDescription
          >Optional. Describe what you did or how it went.</BaseDialogDescription
        >
      </BaseDialogHeader>

      <div class="grid gap-2">
        <label for="completion-note" class="text-sm font-medium">Note</label>
        <BaseTextarea
          id="completion-note"
          v-model="note"
          rows="3"
          placeholder="e.g. Felt great today"
        />
      </div>

      <BaseDialogFooter>
        <BaseButton variant="secondary" @click="handleCancel">Cancel</BaseButton>
        <BaseButton @click="handleConfirm">Complete</BaseButton>
      </BaseDialogFooter>
    </BaseDialogContent>
  </BaseDialog>
</template>
