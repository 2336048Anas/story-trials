'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useUserProfile(address: string | undefined) {
  return useQuery({
    queryKey: ['users', address, 'profile'],
    queryFn: () => api.users.get(address!),
    enabled: !!address,
  });
}

export function useUserAssets(address: string | undefined) {
  return useQuery({
    queryKey: ['users', address, 'assets'],
    queryFn: () => api.users.assets(address!),
    enabled: !!address,
  });
}

export function useUserTrials(address: string | undefined) {
  return useQuery({
    queryKey: ['users', address, 'trials'],
    queryFn: () => api.users.trials(address!),
    enabled: !!address,
  });
}

export function useUserSubmissions(address: string | undefined) {
  return useQuery({
    queryKey: ['users', address, 'submissions'],
    queryFn: () => api.users.submissions(address!),
    enabled: !!address,
  });
}
