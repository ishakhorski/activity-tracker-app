import { ref } from 'vue'

import type { Completion } from '@/types/completion'
import * as completionService from '@/services/completionService'

const completions = ref<Completion[]>(completionService.getAllCompletions())

export function useCompletions() {
  function addCompletion(activityId: string, date: string): Completion {
    const completion = completionService.createCompletion(activityId, date)
    completions.value.push(completion)
    return completion
  }

  function removeCompletion(completionId: string) {
    const index = completions.value.findIndex((c) => c.id === completionId)
    if (index >= 0) {
      const completion = completions.value[index]!
      completions.value.splice(index, 1)
      completionService.deleteCompletion(completionId, completion.completedAt)
    }
  }

  function getCompletions(activityId: string): Completion[] {
    return completions.value.filter((c) => c.activityId === activityId)
  }

  function getCompletionsByDateRange(from: string, to: string): Completion[] {
    return completionService.getCompletionsByDateRange(from, to)
  }

  function getTodayCount(activityId: string): number {
    const now = new Date()
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayEnd.getDate() + 1)

    return completions.value.filter((c) => {
      if (c.activityId !== activityId) return false
      const t = new Date(c.completedAt)
      return t >= dayStart && t < dayEnd
    }).length
  }

  return {
    completions,
    addCompletion,
    removeCompletion,
    getCompletions,
    getCompletionsByDateRange,
    getTodayCount,
  }
}
