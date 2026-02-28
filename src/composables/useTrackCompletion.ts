import { useConfirmDialog } from '@vueuse/core'

import { useCompletionCreateMutation } from '@/composables/mutations/useCompletionCreateMutation'
import type { CreateCompletion } from '@/types/completion'

export function useTrackCompletion() {
  const { addCompletion } = useCompletionCreateMutation()

  const {
    isRevealed: isCompletionDialog,
    reveal: openCompletionDialog,
    confirm: confirmCompletionDialog,
    cancel: cancelCompletionDialog,
  } = useConfirmDialog<Omit<CreateCompletion, 'activityId'>>()

  const complete = (activityId: string, play?: () => void) => {
    addCompletion({ activityId, note: null, completedAt: new Date().toISOString() })
    play?.()
  }

  const completeWithNote = async (activityId: string, play?: () => void) => {
    const { data, isCanceled } = await openCompletionDialog()
    if (isCanceled || !data) return
    addCompletion({ activityId, note: data.note, completedAt: new Date().toISOString() })
    play?.()
  }

  return {
    addCompletion,
    isCompletionDialog,
    confirmCompletionDialog,
    cancelCompletionDialog,
    complete,
    completeWithNote,
  }
}
