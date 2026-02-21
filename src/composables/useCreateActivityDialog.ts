import { ref, type Ref } from 'vue'

const isCreateActivityDialogOpen: Ref<boolean> = ref(false)

export function useCreateActivityDialog(): {
  isCreateActivityDialogOpen: Ref<boolean>
  openCreateActivityDialog: () => void
  closeCreateActivityDialog: () => void
} {
  return {
    isCreateActivityDialogOpen,
    openCreateActivityDialog: () => {
      isCreateActivityDialogOpen.value = true
    },
    closeCreateActivityDialog: () => {
      isCreateActivityDialogOpen.value = false
    },
  }
}
