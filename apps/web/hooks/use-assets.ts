'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { RegisterAssetPayload } from '@/types/api';

export function useAssets() {
  return useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      console.log('[useAssets] Fetching from:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');
      const result = await api.assets.list();
      console.log('[useAssets] Got result:', result);
      return result;
    },
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
    enabled: typeof window !== 'undefined', // Only run on client side
  });
}

export function useRegisterAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterAssetPayload) => api.assets.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}
