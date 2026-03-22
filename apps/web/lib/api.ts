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

type QueryValue = string | number | boolean | null | undefined;

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(path, API_BASE_URL);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url;
}

async function parseError(response: Response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const data = await response.json().catch(() => null);
    if (data?.error) return data.error as string;
    if (data?.details) return data.details as string;
    if (data?.issues) return 'Request validation failed';
    if (data?.message) return data.message as string;
  }

  const text = await response.text().catch(() => '');
  return text || `Request failed with status ${response.status}`;
}

async function request<T>(
  path: string,
  init?: RequestInit,
  query?: Record<string, QueryValue>,
): Promise<T> {
  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, await parseError(response));
  }

  return response.json() as Promise<T>;
}

export const api = {
  health: async () => {
    return request<{ ok: true; service: string; syntheticDataOnly: boolean; note: string }>('/health');
  },

  trials: {
    list: async (): Promise<TrialsResponse> => {
      return request<TrialsResponse>('/trials');
    },
    get: async (id: string): Promise<TrialResponse> => {
      return request<TrialResponse>(`/trials/${id}`);
    },
    create: async (data: CreateTrialPayload): Promise<CreateTrialResponse> => {
      return request<CreateTrialResponse>('/trials', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: UpdateTrialPayload): Promise<TrialResponse> => {
      return request<TrialResponse>(`/trials/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
  },

  submissions: {
    list: async (trialId: string): Promise<SubmissionsResponse> => {
      return request<SubmissionsResponse>(`/trials/${trialId}/submissions`);
    },
    create: async (trialId: string, data: CreateSubmissionPayload): Promise<SubmissionResponse> => {
      return request<SubmissionResponse>(`/trials/${trialId}/submissions`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (
      trialId: string,
      submissionId: string,
      data: UpdateSubmissionPayload,
    ): Promise<SubmissionResponse> => {
      return request<SubmissionResponse>(`/trials/${trialId}/submissions/${submissionId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
  },

  assets: {
    list: async (): Promise<{ ok: true; assets: any[] }> => {
      return request<{ ok: true; assets: any[] }>('/assets');
    },
    get: async (id: string): Promise<AssetResponse> => {
      return request<AssetResponse>(`/assets/${id}`);
    },
    register: async (data: RegisterAssetPayload): Promise<RegisterAssetResponse> => {
      const response = await request<
        RegisterAssetResponse & { explorerUrl?: string }
      >('/assets/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      return {
        ...response,
        tx: {
          ...response.tx,
          explorerUrl: response.tx.explorerUrl || response.explorerUrl,
        },
      };
    },
  },

  licenses: {
    list: async (buyerId?: string): Promise<LicensesResponse> => {
      return request<LicensesResponse>('/licenses', undefined, { buyerId });
    },
    get: async (id: string): Promise<LicenseResponse> => {
      return request<LicenseResponse>(`/licenses/${id}`);
    },
    create: async (data: CreateLicensePayload): Promise<CreateLicenseResponse> => {
      return request<CreateLicenseResponse>('/licenses', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  payments: {
    create: async (data: CreatePaymentPayload): Promise<CreatePaymentResponse> => {
      return request<CreatePaymentResponse>('/payments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    createRoyalty: async (data: CreateRoyaltyPayload): Promise<CreateRoyaltyResponse> => {
      return request<CreateRoyaltyResponse>('/payments/royalties', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    listRoyalties: async (recipientId: string): Promise<RoyaltiesResponse> => {
      return request<RoyaltiesResponse>('/payments/royalties', undefined, { recipientId });
    },
    listPayouts: async (recipientId: string): Promise<PayoutsResponse> => {
      return request<PayoutsResponse>('/payments/payouts', undefined, { recipientId });
    },
    checkClaimable: async (ipId: string, claimer: string): Promise<ClaimableResponse> => {
      return request<ClaimableResponse>('/payments/royalties/claimable', undefined, {
        ipId,
        claimer,
      });
    },
    claimRevenue: async (data: ClaimRevenuePayload): Promise<ClaimRevenueResponse> => {
      return request<ClaimRevenueResponse>('/payments/royalties/claim', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  users: {
    get: async (address: string): Promise<UserProfileResponse> => {
      return request<UserProfileResponse>(`/users/${address}`);
    },
    assets: async (address: string): Promise<UserAssetsResponse> => {
      return request<UserAssetsResponse>(`/users/${address}/assets`);
    },
    trials: async (address: string): Promise<UserTrialsResponse> => {
      return request<UserTrialsResponse>(`/users/${address}/trials`);
    },
    submissions: async (address: string): Promise<UserSubmissionsResponse> => {
      return request<UserSubmissionsResponse>(`/users/${address}/submissions`);
    },
  },
};
