import type { Completion } from '@/types/completion'

const STORAGE_PREFIX = 'completions:'
const LEGACY_KEY = 'completions'

/**
 * Extract YYYY-MM-DD from a date string and return the bucketed storage key.
 */
const dateKey = (date: string): string => {
  const d = new Date(date)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${STORAGE_PREFIX}${yyyy}-${mm}-${dd}`
}

const getDatesBetween = (from: string, to: string): string[] => {
  const dates: string[] = []
  const start = new Date(from)
  const end = new Date(to)
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  const current = new Date(start)
  while (current <= end) {
    const yyyy = current.getFullYear()
    const mm = String(current.getMonth() + 1).padStart(2, '0')
    const dd = String(current.getDate()).padStart(2, '0')
    dates.push(`${yyyy}-${mm}-${dd}`)
    current.setDate(current.getDate() + 1)
  }
  return dates
}

const getBucket = (key: string): Completion[] => {
  const raw = localStorage.getItem(key)
  if (!raw) return []
  return JSON.parse(raw) as Completion[]
}

const saveBucket = (key: string, items: Completion[]): void => {
  if (items.length === 0) {
    localStorage.removeItem(key)
  } else {
    localStorage.setItem(key, JSON.stringify(items))
  }
}

export const getAllCompletions = (): Completion[] => {
  const all: Completion[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(STORAGE_PREFIX)) {
      all.push(...getBucket(key))
    }
  }
  return all
}

export const getCompletionsByDateRange = (from: string, to: string): Completion[] => {
  const dates = getDatesBetween(from, to)
  const results: Completion[] = []
  for (const date of dates) {
    results.push(...getBucket(`${STORAGE_PREFIX}${date}`))
  }
  return results
}

export const createCompletion = (activityId: string, date: string): Completion => {
  const now = new Date().toISOString()
  const completion: Completion = {
    id: crypto.randomUUID(),
    activityId,
    completedAt: date,
    createdAt: now,
    updatedAt: now,
  }

  const key = dateKey(date)
  const bucket = getBucket(key)
  bucket.push(completion)
  saveBucket(key, bucket)

  return completion
}

export const deleteCompletion = (id: string, date: string): boolean => {
  const key = dateKey(date)
  const bucket = getBucket(key)
  const index = bucket.findIndex((c) => c.id === id)
  if (index === -1) return false
  bucket.splice(index, 1)
  saveBucket(key, bucket)
  return true
}
