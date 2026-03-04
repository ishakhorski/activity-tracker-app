<script setup lang="ts">
import {
  BaseDialog,
  BaseDialogContent,
  BaseDialogHeader,
  BaseDialogTitle,
  BaseDialogDescription,
  BaseDialogFooter,
} from '@/components/atoms/dialog'
import { BaseButton } from '@/components/atoms/button'

const emit = defineEmits<{ confirm: []; cancel: [] }>()

const open = defineModel<boolean>('open', { default: false })

const handleConfirm = () => {
  emit('confirm')
  open.value = false
}

const handleCancel = () => {
  emit('cancel')
  open.value = false
}

const handleUpdate = (newOpen: boolean) => {
  if (!newOpen) handleCancel()
}
</script>

<template>
  <BaseDialog :open="open" @update:open="handleUpdate">
    <BaseDialogContent>
      <BaseDialogHeader>
        <BaseDialogTitle>Delete activity?</BaseDialogTitle>
        <BaseDialogDescription>
          This will permanently delete the activity and all its completion history. This cannot be
          undone.
        </BaseDialogDescription>
      </BaseDialogHeader>
      <BaseDialogFooter>
        <BaseButton variant="secondary" @click="handleCancel">Cancel</BaseButton>
        <BaseButton
          variant="secondary"
          class="text-destructive hover:bg-destructive/10 active:bg-destructive/15"
          @click="handleConfirm"
        >
          Delete
        </BaseButton>
      </BaseDialogFooter>
    </BaseDialogContent>
  </BaseDialog>
</template>
