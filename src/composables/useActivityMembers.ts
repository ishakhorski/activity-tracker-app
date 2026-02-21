import { computed, toValue, type MaybeRef } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import type {
  ActivityMember,
  CreateActivityMember,
  UpdateActivityMember,
} from '@/types/activityMember'
import {
  getActivityMembers,
  createActivityMember,
  updateActivityMember,
  deleteActivityMember,
} from '@/services/activityMembersService'

const activityMembersQueryKey = (activityId: string) => ['activity-members', activityId] as const

// --- Query ---

export const useActivityMembersQuery = (activityId: MaybeRef<string>) => {
  return useQuery({
    queryKey: computed(() => activityMembersQueryKey(toValue(activityId))),
    queryFn: async () => {
      const response = await getActivityMembers(toValue(activityId))
      return response.data
    },
    enabled: computed(() => !!toValue(activityId)),
  })
}

// --- Mutations ---

export const useActivityMemberCreateMutation = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: (data: CreateActivityMember) => createActivityMember(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: activityMembersQueryKey(variables.activityId),
      })
    },
  })

  return {
    addActivityMember: (data: CreateActivityMember) => mutate(data),
  }
}

export const useActivityMemberUpdateMutation = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: ({ id, data }: { id: string; activityId: string; data: UpdateActivityMember }) =>
      updateActivityMember(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: activityMembersQueryKey(variables.activityId),
      })
    },
  })

  return {
    updateActivityMember: (id: string, activityId: string, data: UpdateActivityMember) =>
      mutate({ id, activityId, data }),
  }
}

export const useActivityMemberDeleteMutation = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: ({ id }: { id: string; activityId: string }) => deleteActivityMember(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: activityMembersQueryKey(variables.activityId),
      })
    },
  })

  return {
    removeActivityMember: (id: string, activityId: string) => mutate({ id, activityId }),
  }
}
