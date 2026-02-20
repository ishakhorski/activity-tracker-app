import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import type { Activity } from '@/types/activity'
import type { ActivitySchedule } from '@/types/activitySchedule'
import * as activitiesService from '@/services/activitiesService'

const ACTIVITIES_QUERY_KEY = ['activities'] as const

// --- Query ---

export const useActivitiesQuery = () => {
  return useQuery({
    queryKey: ACTIVITIES_QUERY_KEY,
    queryFn: async () => {
      const response = await activitiesService.getAllActivities()
      return response.data
    },
  })
}

// --- Mutations ---

export const useActivityCreateMutation = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: (data: { title: string; schedule: ActivitySchedule }) =>
      activitiesService.createActivity(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ACTIVITIES_QUERY_KEY })
      const previous = queryClient.getQueryData<Activity[]>(ACTIVITIES_QUERY_KEY)

      const now = new Date().toISOString()
      const optimistic: Activity = {
        id: `temp-${crypto.randomUUID()}`,
        title: data.title,
        schedule: data.schedule,
        sortOrder: previous?.length ?? 0,
        createdAt: now,
        updatedAt: now,
      }

      queryClient.setQueryData<Activity[]>(ACTIVITIES_QUERY_KEY, (old) => [
        ...(old ?? []),
        optimistic,
      ])

      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ACTIVITIES_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY })
    },
  })

  return {
    createActivity: (data: { title: string; schedule: ActivitySchedule }) => mutate(data),
  }
}

export const useActivityUpdateMutation = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<Pick<Activity, 'title' | 'schedule'>>
    }) => activitiesService.updateActivity(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ACTIVITIES_QUERY_KEY })
      const previous = queryClient.getQueryData<Activity[]>(ACTIVITIES_QUERY_KEY)

      queryClient.setQueryData<Activity[]>(ACTIVITIES_QUERY_KEY, (old) =>
        (old ?? []).map((a) =>
          a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a,
        ),
      )

      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ACTIVITIES_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY })
    },
  })

  return {
    updateActivity: (id: string, data: Partial<Pick<Activity, 'title' | 'schedule'>>) =>
      mutate({ id, data }),
  }
}

export const useActivityArchiveMutation = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: (id: string) => activitiesService.archiveActivity(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ACTIVITIES_QUERY_KEY })
      const previous = queryClient.getQueryData<Activity[]>(ACTIVITIES_QUERY_KEY)

      const now = new Date().toISOString()
      queryClient.setQueryData<Activity[]>(ACTIVITIES_QUERY_KEY, (old) =>
        (old ?? []).map((a) => (a.id === id ? { ...a, archivedAt: now, updatedAt: now } : a)),
      )

      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ACTIVITIES_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY })
    },
  })

  return { archiveActivity: (id: string) => mutate(id) }
}

export const useActivityUnarchiveMutation = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: (id: string) => activitiesService.unarchiveActivity(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ACTIVITIES_QUERY_KEY })
      const previous = queryClient.getQueryData<Activity[]>(ACTIVITIES_QUERY_KEY)

      queryClient.setQueryData<Activity[]>(ACTIVITIES_QUERY_KEY, (old) =>
        (old ?? []).map((a) =>
          a.id === id ? { ...a, archivedAt: undefined, updatedAt: new Date().toISOString() } : a,
        ),
      )

      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ACTIVITIES_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY })
    },
  })

  return { unarchiveActivity: (id: string) => mutate(id) }
}

export const useActivityDeleteMutation = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: (id: string) => activitiesService.deleteActivity(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ACTIVITIES_QUERY_KEY })
      const previous = queryClient.getQueryData<Activity[]>(ACTIVITIES_QUERY_KEY)

      queryClient.setQueryData<Activity[]>(ACTIVITIES_QUERY_KEY, (old) =>
        (old ?? []).filter((a) => a.id !== id),
      )

      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ACTIVITIES_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY })
    },
  })

  return { deleteActivity: (id: string) => mutate(id) }
}
