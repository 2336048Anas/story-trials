'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ClaimRevenuePayload } from '@/types/api';

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

export function useClaimableRevenue(ipId: string | undefined, claimer: string | undefined) {
  return useQuery({
    queryKey: ['claimable', ipId, claimer],
    queryFn: () => api.payments.checkClaimable(ipId!, claimer!),
    enabled: !!ipId && !!claimer,
    refetchInterval: 30000, // refresh every 30s
  });
}

export function useClaimRevenue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ClaimRevenuePayload) => api.payments.claimRevenue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claimable'] });
      queryClient.invalidateQueries({ queryKey: ['royalties'] });
    },
  });
}
