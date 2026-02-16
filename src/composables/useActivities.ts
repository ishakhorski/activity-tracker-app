import { computed, ref, watch } from 'vue'

import type { Activity } from '@/types/activity'
import {
  ACTIVITY_SCHEDULE_TYPE,
  type Weekday,
  type ActivitySchedule,
} from '@/types/activitySchedule'
import * as activityService from '@/services/activityService'
import { useCompletions } from './useCompletions'

const activities = ref<Activity[]>(activityService.getAllActivities())

const completedOrder = ref<Map<string, number>>(new Map())
let completedSeq = 0

// Schedule helpers

export function isScheduledOnDay(activity: Activity, dayOfWeek: number): boolean {
  const schedule = activity.schedule
  if (schedule.type === ACTIVITY_SCHEDULE_TYPE.WEEKLY) {
    return schedule.days.includes(dayOfWeek as Weekday)
  }
  return true
}

export function isScheduledToday(activity: Activity): boolean {
  return isScheduledOnDay(activity, new Date().getDay())
}

export function getTargetForDay(activity: Activity, dayOfWeek: number): number {
  const schedule = activity.schedule
  if (schedule.type === ACTIVITY_SCHEDULE_TYPE.WEEKLY) {
    return schedule.days.includes(dayOfWeek as Weekday) ? schedule.targetCompletions : 0
  }
  return schedule.targetCompletions
}

export function useActivities() {
  const { getTodayCount } = useCompletions()

  const activeActivities = computed(() => activities.value.filter((a) => !a.archivedAt))

  const archivedActivities = computed(() => activities.value.filter((a) => !!a.archivedAt))

  function isTargetMet(activity: Activity): boolean {
    if (!isScheduledToday(activity)) return false
    return getTodayCount(activity.id) >= activity.schedule.targetCompletions
  }

  // 0 = scheduled & not done, 1 = not scheduled today, 2 = completed
  function getSortGroup(activity: Activity): number {
    if (isTargetMet(activity)) return 2
    if (!isScheduledToday(activity)) return 1
    return 0
  }

  watch(
    () => activeActivities.value.map((a) => isTargetMet(a)),
    (curr, prev) => {
      activeActivities.value.forEach((a, i) => {
        const justCompleted = curr[i] && (!prev || !prev[i])
        if (justCompleted && !completedOrder.value.has(a.id)) {
          completedOrder.value.set(a.id, completedSeq++)
        }
        if (!curr[i]) {
          completedOrder.value.delete(a.id)
        }
      })
    },
    { immediate: true },
  )

  const sortedActivities = computed(() => {
    return [...activeActivities.value].sort((a, b) => {
      const aGroup = getSortGroup(a)
      const bGroup = getSortGroup(b)
      if (aGroup !== bGroup) return aGroup - bGroup
      if (aGroup === 2) {
        const aOrder = completedOrder.value.get(a.id) ?? 0
        const bOrder = completedOrder.value.get(b.id) ?? 0
        return bOrder - aOrder
      }
      return a.sortOrder - b.sortOrder
    })
  })

  function createActivity(data: { title: string; schedule: ActivitySchedule }): Activity {
    const activity = activityService.createActivity(data)
    activities.value.push(activity)
    return activity
  }

  function updateActivity(id: string, data: Partial<Pick<Activity, 'title' | 'schedule'>>) {
    const activity = activities.value.find((a) => a.id === id)
    if (!activity) return
    Object.assign(activity, { ...data, updatedAt: new Date().toISOString() })
    activityService.updateActivity(id, data)
  }

  function archiveActivity(id: string) {
    const activity = activities.value.find((a) => a.id === id)
    if (activity) {
      activity.archivedAt = new Date().toISOString()
      activityService.archiveActivity(id)
    }
  }

  function unarchiveActivity(id: string) {
    const activity = activities.value.find((a) => a.id === id)
    if (activity) {
      activity.archivedAt = undefined
      activityService.unarchiveActivity(id)
    }
  }

  function deleteActivity(id: string) {
    const index = activities.value.findIndex((a) => a.id === id)
    if (index >= 0) {
      activities.value.splice(index, 1)
      activityService.deleteActivity(id)
    }
  }

  return {
    activities,
    activeActivities,
    archivedActivities,
    sortedActivities,
    createActivity,
    updateActivity,
    archiveActivity,
    unarchiveActivity,
    deleteActivity,
    isTargetMet,
    isScheduledToday,
    getSortGroup,
  }
}
