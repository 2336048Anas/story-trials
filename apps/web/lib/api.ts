import type {
  TrialsResponse,
  TrialResponse,
  CreateTrialPayload,
  CreateTrialResponse,
  UpdateTrialPayload,
  RegisterAssetPayload,
  RegisterAssetResponse,
  AssetResponse,
  CreatePaymentPayload,
  CreatePaymentResponse,
  CreateRoyaltyPayload,
  CreateRoyaltyResponse,
  RoyaltiesResponse,
  PayoutsResponse,
  LicensesResponse,
  LicenseResponse,
  CreateLicensePayload,
  CreateLicenseResponse,
  SubmissionsResponse,
  SubmissionResponse,
  CreateSubmissionPayload,
  UpdateSubmissionPayload,
  UserProfileResponse,
  UserAssetsResponse,
  UserTrialsResponse,
  UserSubmissionsResponse,
  ClaimableResponse,
  ClaimRevenuePayload,
  ClaimRevenueResponse,
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
    get: (id: string) => fetchApi<TrialResponse>(`/trials/${id}`),
    create: (data: CreateTrialPayload) =>
      fetchApi<CreateTrialResponse>('/trials', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: UpdateTrialPayload) =>
      fetchApi<TrialResponse>(`/trials/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  // Submissions
  submissions: {
    list: (trialId: string) =>
      fetchApi<SubmissionsResponse>(`/trials/${trialId}/submissions`),
    create: (trialId: string, data: CreateSubmissionPayload) =>
      fetchApi<SubmissionResponse>(`/trials/${trialId}/submissions`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (trialId: string, submissionId: string, data: UpdateSubmissionPayload) =>
      fetchApi<SubmissionResponse>(`/trials/${trialId}/submissions/${submissionId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  // Assets
  assets: {
    list: () => fetchApi<{ ok: true; assets: any[] }>('/assets'),
    get: (id: string) => fetchApi<AssetResponse>(`/assets/${id}`),
    register: (data: RegisterAssetPayload) =>
      fetchApi<RegisterAssetResponse>('/assets/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Licenses
  licenses: {
    list: (buyerId?: string) =>
      fetchApi<LicensesResponse>(buyerId ? `/licenses?buyerId=${encodeURIComponent(buyerId)}` : '/licenses'),
    get: (id: string) => fetchApi<LicenseResponse>(`/licenses/${id}`),
    create: (data: CreateLicensePayload) =>
      fetchApi<CreateLicenseResponse>('/licenses', {
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
    listRoyalties: (recipientId: string) =>
      fetchApi<RoyaltiesResponse>(`/payments/royalties?recipientId=${encodeURIComponent(recipientId)}`),
    listPayouts: (recipientId: string) =>
      fetchApi<PayoutsResponse>(`/payments/payouts?recipientId=${encodeURIComponent(recipientId)}`),
    checkClaimable: (ipId: string, claimer: string) =>
      fetchApi<ClaimableResponse>(`/payments/royalties/claimable?ipId=${encodeURIComponent(ipId)}&claimer=${encodeURIComponent(claimer)}`),
    claimRevenue: (data: ClaimRevenuePayload) =>
      fetchApi<ClaimRevenueResponse>('/payments/royalties/claim', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Users
  users: {
    get: (address: string) =>
      fetchApi<UserProfileResponse>(`/users/${address}`),
    assets: (address: string) =>
      fetchApi<UserAssetsResponse>(`/users/${address}/assets`),
    trials: (address: string) =>
      fetchApi<UserTrialsResponse>(`/users/${address}/trials`),
    submissions: (address: string) =>
      fetchApi<UserSubmissionsResponse>(`/users/${address}/submissions`),
  },
};
