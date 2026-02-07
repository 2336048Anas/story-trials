'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
  CreateTrialPayload,
  UpdateTrialPayload,
  CreateSubmissionPayload,
  UpdateSubmissionPayload,
} from '@/types/api';

export function useTrials() {
  return useQuery({
    queryKey: ['trials'],
    queryFn: () => api.trials.list(),
  });
}

export function useTrial(id: string) {
  return useQuery({
    queryKey: ['trials', id],
    queryFn: () => api.trials.get(id),
    enabled: !!id,
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

export function useUpdateTrial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTrialPayload }) =>
      api.trials.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trials'] });
      queryClient.invalidateQueries({ queryKey: ['trials', variables.id] });
    },
  });
}

export function useSubmissions(trialId: string) {
  return useQuery({
    queryKey: ['trials', trialId, 'submissions'],
    queryFn: () => api.submissions.list(trialId),
    enabled: !!trialId,
  });
}

export function useCreateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      trialId,
      data,
    }: {
      trialId: string;
      data: CreateSubmissionPayload;
    }) => api.submissions.create(trialId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['trials', variables.trialId, 'submissions'],
      });
      queryClient.invalidateQueries({ queryKey: ['trials'] });
    },
  });
}

export function useUpdateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      trialId,
      submissionId,
      data,
    }: {
      trialId: string;
      submissionId: string;
      data: UpdateSubmissionPayload;
    }) => api.submissions.update(trialId, submissionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['trials', variables.trialId, 'submissions'],
      });
    },
  });
}
