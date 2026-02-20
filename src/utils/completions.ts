import type { Completion } from '@/types/completion'

export function getDateRange(days = 7) {
  const now = new Date()
  const from = new Date(now)
  from.setDate(from.getDate() - days)
  return { from: from.toISOString(), to: now.toISOString() }
}

export function getCompletionsByActivity(
  completions: Completion[],
  activityId: string,
): Completion[] {
  return completions.filter((c) => c.activityId === activityId)
}

export function getTodayCompletionCount(completions: Completion[], activityId: string): number {
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
