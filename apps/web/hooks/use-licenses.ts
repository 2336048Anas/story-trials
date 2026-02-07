'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CreateLicensePayload } from '@/types/api';

export function useLicenses(buyerId?: string) {
  return useQuery({
    queryKey: ['licenses', buyerId],
    queryFn: () => api.licenses.list(buyerId),
    enabled: !!buyerId,
  });
}

export function useLicense(id: string) {
  return useQuery({
    queryKey: ['licenses', 'detail', id],
    queryFn: () => api.licenses.get(id),
    enabled: !!id,
  });
}

export function useCreateLicense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLicensePayload) => api.licenses.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licenses'] });
    },
  });
}
