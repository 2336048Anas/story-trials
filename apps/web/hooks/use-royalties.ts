'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useRoyalties(recipientId: string | undefined) {
  return useQuery({
    queryKey: ['royalties', recipientId],
    queryFn: () => api.payments.listRoyalties(recipientId!),
    enabled: !!recipientId,
  });
}

export function usePayouts(recipientId: string | undefined) {
  return useQuery({
    queryKey: ['payouts', recipientId],
    queryFn: () => api.payments.listPayouts(recipientId!),
    enabled: !!recipientId,
  });
}
