import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

import type { Activity, CreateActivity, UpdateActivity } from "@/types/activity";
import {
  getAllActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} from "@/services/activitiesService";

const ACTIVITIES_QUERY_KEY = ["activities"] as const;

// --- Query ---

export const useActivitiesQuery = () => {
  return useQuery({
    queryKey: ACTIVITIES_QUERY_KEY,
    queryFn: async () => {
      const response = await getAllActivities();
      return response.data;
    },
  });
};

// --- Mutations ---

export const useActivityCreateMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (data: CreateActivity) => createActivity(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ACTIVITIES_QUERY_KEY });
      const previous = queryClient.getQueryData<Activity[]>(ACTIVITIES_QUERY_KEY);

      const now = new Date().toISOString();
      const tempId = `temp-${crypto.randomUUID()}`;
      const optimistic: Activity = {
        id: tempId,
        title: data.title,
        description: data.description,
        type: data.type,
        schedule: data.schedule,
        createdAt: now,
        updatedAt: now,
        archivedAt: null,
      };

      queryClient.setQueryData<Activity[]>(ACTIVITIES_QUERY_KEY, (old) => [
        ...(old ?? []),
        optimistic,
      ]);

      return { previous, tempId };
    },
    onSuccess: (id, _vars, context) => {
      queryClient.setQueryData<Activity[]>(ACTIVITIES_QUERY_KEY, (old) =>
        (old ?? []).map((a) => (a.id === context.tempId ? { ...a, id } : a)),
      );
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ACTIVITIES_QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
    },
  });

  return {
    createActivity: (data: CreateActivity) => mutate(data),
  };
};

export const useActivityUpdateMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateActivity }) => updateActivity(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ACTIVITIES_QUERY_KEY });
      const previous = queryClient.getQueryData<Activity[]>(ACTIVITIES_QUERY_KEY);

      queryClient.setQueryData<Activity[]>(ACTIVITIES_QUERY_KEY, (old) =>
        (old ?? []).map((a) =>
          a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a,
        ),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ACTIVITIES_QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
    },
  });

  return {
    updateActivity: (id: string, data: UpdateActivity) => mutate({ id, data }),
  };
};

export const useActivityDeleteMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (activityId: string) => deleteActivity(activityId),
    onMutate: async (activityId: string) => {
      await queryClient.cancelQueries({ queryKey: ACTIVITIES_QUERY_KEY });
      const previous = queryClient.getQueryData<Activity[]>(ACTIVITIES_QUERY_KEY);

      queryClient.setQueryData<Activity[]>(ACTIVITIES_QUERY_KEY, (old) =>
        (old ?? []).filter((a) => a.id !== activityId),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ACTIVITIES_QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
    },
  });

  return { deleteActivity: (activityId: string) => mutate(activityId) };
};
