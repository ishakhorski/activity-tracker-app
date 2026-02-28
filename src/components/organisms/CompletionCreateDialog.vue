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

const props = defineProps<{
  confirm: (data: { note: string }) => void
  cancel: () => void
}>()

const open = defineModel<boolean>('open', { default: false })

const note = ref('')

const handleConfirm = () => {
  props.confirm({
    note: note.value.trim(),
  })
  note.value = ''
  open.value = false
}

const handleCancel = () => {
  props.cancel()
  note.value = ''
  open.value = false
}

const handleUpdate = (newOpen: boolean) => {
  if (!newOpen) {
    handleCancel()
  }
}
</script>

<template>
  <BaseDialog :open="open" @update:open="handleUpdate">
    <BaseDialogContent as="form" @submit.prevent>
      <BaseDialogHeader>
        <BaseDialogTitle> Add a note </BaseDialogTitle>
        <BaseDialogDescription>
          Optional. Describe what you did or how it went.
        </BaseDialogDescription>
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
        <BaseButton variant="secondary" type="button" @click="handleCancel"> Cancel </BaseButton>
        <BaseButton type="submit" @click="handleConfirm"> Complete </BaseButton>
      </BaseDialogFooter>
    </BaseDialogContent>
  </BaseDialog>
</template>
