import type {
  TrialsResponse,
  CreateTrialPayload,
  CreateTrialResponse,
  RegisterAssetPayload,
  RegisterAssetResponse,
  CreatePaymentPayload,
  CreatePaymentResponse,
  CreateRoyaltyPayload,
  CreateRoyaltyResponse,
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, error.error || 'Request failed');
  }

  return response.json();
}

export const api = {
  // Health check
  health: () => fetchApi('/health'),

  // Trials
  trials: {
    list: () => fetchApi<TrialsResponse>('/trials'),
    create: (data: CreateTrialPayload) =>
      fetchApi<CreateTrialResponse>('/trials', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Assets
  assets: {
    list: () => fetchApi<{ ok: true; assets: any[] }>('/assets'),
    register: (data: RegisterAssetPayload) =>
      fetchApi<RegisterAssetResponse>('/assets/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Payments (synthetic only)
  payments: {
    create: (data: CreatePaymentPayload) =>
      fetchApi<CreatePaymentResponse>('/payments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    createRoyalty: (data: CreateRoyaltyPayload) =>
      fetchApi<CreateRoyaltyResponse>('/payments/royalties', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
