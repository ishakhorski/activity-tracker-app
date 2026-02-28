import { computed, ref } from 'vue'

import { useActivitiesQuery } from '@/composables/queries/useActivitiesQuery'
import { useCompletionsQuery } from '@/composables/queries/useCompletionsQuery'
import { enrichActivity, getDayStatus, getTargetForDay, toLocalDateKey } from '@/utils/activities'
import { getDateRange } from '@/utils/completions'

export const useEnrichedActivities = () => {
  const { from, to } = getDateRange()

  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    isError: activitiesError,
    refetch: refetchActivities,
  } = useActivitiesQuery()

  const {
    data: completionsData,
    isLoading: completionsLoading,
    isError: completionsError,
    refetch: refetchCompletions,
  } = useCompletionsQuery(ref(from), ref(to))

  const isLoading = computed(() => activitiesLoading.value || completionsLoading.value)
  const isError = computed(() => activitiesError.value || completionsError.value)

  const enrichedActivities = computed(() => {
    const activities = activitiesData.value ?? []
    const completions = completionsData.value ?? []
    const todayKey = toLocalDateKey(new Date())
    const todayWeekday = new Date().getDay()

    return activities
      .filter((a) => !a.archivedAt)
      .map((a) => enrichActivity(a, completions))
      .sort((a, b) => {
        const aCount = a.completionsByDate[todayKey]?.length ?? 0
        const bCount = b.completionsByDate[todayKey]?.length ?? 0
        const aCompleted =
          getDayStatus(aCount, getTargetForDay(a.schedule, todayWeekday)) === 'completed'
        const bCompleted =
          getDayStatus(bCount, getTargetForDay(b.schedule, todayWeekday)) === 'completed'
        if (aCompleted !== bCompleted) return aCompleted ? 1 : -1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  })

  const retryEnrichedActivities = () => {
    refetchActivities()
    refetchCompletions()
  }

  return {
    enrichedActivities,
    isEnrichedActivitiesLoading: isLoading,
    isEnrichedActivitiesError: isError,
    retryEnrichedActivities,
  }
}
