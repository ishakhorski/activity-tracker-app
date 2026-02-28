import type { Completion } from '@/types/completion'

export const getDateRange = (days = 7): { from: string; to: string } => {
  const to = new Date()
  to.setHours(23, 59, 59, 999)
  const from = new Date(to)
  from.setDate(from.getDate() - days)
  from.setHours(0, 0, 0, 0)
  return { from: from.toISOString(), to: to.toISOString() }
}

export const getCompletionsByActivity = (
  completions: Completion[],
  activityId: string,
): Completion[] => completions.filter((c) => c.activityId === activityId)

export const getTodayCompletionCount = (completions: Completion[], activityId: string): number => {
  const now = new Date()
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dayEnd = new Date(dayStart)
  dayEnd.setDate(dayEnd.getDate() + 1)

  return completions.filter((c) => {
    if (c.activityId !== activityId) return false
    const t = new Date(c.completedAt)
    return t >= dayStart && t < dayEnd
  }).length
}
