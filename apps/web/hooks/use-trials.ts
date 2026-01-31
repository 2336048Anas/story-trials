'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CreateTrialPayload } from '@/types/api';

export function useTrials() {
  return useQuery({
    queryKey: ['trials'],
    queryFn: () => api.trials.list(),
  });
}

export function useCreateTrial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTrialPayload) => api.trials.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trials'] });
    },
  });
}
