// User types
export type UserRole = 'CONTRIBUTOR' | 'BUYER' | 'ADMIN';

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  email?: string;
  name?: string;
  role: UserRole;
  walletAddress?: string;
}

// Trial types
export interface Trial {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description?: string;
  rewardUsd: number; // cents - synthetic only
  isOpen: boolean;
  buyerId: string;
  buyer?: {
    id: string;
    name?: string;
    walletAddress?: string;
  };
  _count?: {
    submissions: number;
  };
}

export interface CreateTrialPayload {
  title: string;
  description?: string;
  rewardUsd: number;
  buyerId: string;
}

export interface TrialsResponse {
  ok: boolean;
  trials: Trial[];
}

export interface CreateTrialResponse {
  ok: boolean;
  trial: Trial;
  note: string;
}

export interface TrialResponse {
  ok: boolean;
  trial: Trial;
}

export interface UpdateTrialPayload {
  title?: string;
  description?: string;
  isOpen?: boolean;
}

// Submission types
export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Submission {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  trialId: string;
  dataCid: string;
  assetId?: string;
  status: SubmissionStatus;
  user?: {
    id: string;
    name?: string;
    walletAddress?: string;
  };
  asset?: DataAsset;
}

export interface CreateSubmissionPayload {
  userId: string;
  dataCid: string;
  assetId?: string;
}

export interface UpdateSubmissionPayload {
  status: SubmissionStatus;
}

export interface SubmissionsResponse {
  ok: boolean;
  submissions: Submission[];
}

export interface SubmissionResponse {
  ok: boolean;
  submission: Submission;
  note?: string;
}

// Asset types
export interface DataAsset {
  id: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  title: string;
  description?: string;
  ipfsCid: string;
  metadataCid: string;
  termsRef?: string;
  isListed: boolean;
  ipAssetId?: string;
  storyChainId?: number;
  storyTxHash?: string;
  owner?: {
    id: string;
    walletAddress?: string;
    name?: string;
  };
}

export interface AssetResponse {
  ok: boolean;
  asset: DataAsset;
}

export interface RegisterAssetPayload {
  title: string;
  description?: string;
  ownerAddress: string;
  ipfsCid: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number | boolean;
  }>;
  chainId?: number;
}

export interface RegisterAssetResponse {
  ok: boolean;
  asset: DataAsset;
  owner: {
    id: string;
    walletAddress?: string;
  };
  tx: {
    chainId: number;
    ipAssetId?: string;
    txHash?: string;
  };
  ipfs: {
    dataCid: string;
    metadataCid: string;
  };
}

// License types
export type LicenseStatus = 'ISSUED' | 'REVOKED';

export interface License {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: LicenseStatus;
  assetId: string;
  buyerId: string;
  txHash?: string;
  expiresAt?: string;
  chainLicenseId?: string;
  asset?: {
    id: string;
    title: string;
    description?: string;
    ipfsCid: string;
    metadataCid?: string;
    isListed: boolean;
    ipAssetId?: string;
    storyChainId?: number;
    owner?: {
      id: string;
      walletAddress?: string;
      name?: string;
    };
  };
  buyer?: {
    id: string;
    walletAddress?: string;
    name?: string;
  };
  payment?: {
    id: string;
    amount: number;
    currency: string;
  };
  royalties?: RoyaltyEvent[];
}

export interface LicensesResponse {
  ok: boolean;
  licenses: License[];
}

export interface LicenseResponse {
  ok: boolean;
  license: License;
}

export interface CreateLicensePayload {
  assetId: string;
  buyerAddress: string;
  expiresAt?: string;
}

export interface CreateLicenseResponse {
  ok: boolean;
  license: License;
  warning: string;
}

// Payment types (synthetic only)
export interface CreatePaymentPayload {
  licenseId: string;
  amount: number;
  currency?: 'USD' | 'EUR' | 'GBP';
  chainTx?: string;
}

export interface CreatePaymentResponse {
  ok: boolean;
  payment: any;
  warning: string;
}

export interface CreateRoyaltyPayload {
  licenseId: string;
  recipientId: string;
  amount: number;
  currency?: 'USD' | 'EUR' | 'GBP';
  note?: string;
}

export interface CreateRoyaltyResponse {
  ok: boolean;
  royalty: any;
  warning: string;
}

// Royalty types (synthetic only)
export type PayoutStatus = 'PENDING' | 'PAID' | 'FAILED';
export type Currency = 'USD' | 'EUR' | 'GBP';

export interface RoyaltyEvent {
  id: string;
  createdAt: string;
  licenseId: string;
  recipientId: string;
  amount: number; // minor units (cents)
  currency: Currency;
  note?: string;
  payoutId?: string;
  license?: {
    id: string;
    asset?: {
      id: string;
      title: string;
    };
  };
  payout?: {
    id: string;
    status: PayoutStatus;
  };
}

export interface Payout {
  id: string;
  createdAt: string;
  updatedAt: string;
  recipientId: string;
  amount: number; // minor units (cents)
  currency: Currency;
  status: PayoutStatus;
  reference?: string;
  events?: {
    id: string;
    amount: number;
    currency: Currency;
    licenseId: string;
  }[];
}

export interface RoyaltiesResponse {
  ok: boolean;
  royalties: RoyaltyEvent[];
  warning: string;
}

export interface PayoutsResponse {
  ok: boolean;
  payouts: Payout[];
  warning: string;
}

// User profile types
export interface UserProfile extends User {
  _count?: {
    assets: number;
    trials: number;
    submissions: number;
  };
}

export interface UserProfileResponse {
  ok: boolean;
  user: UserProfile;
}

export interface UserAssetsResponse {
  ok: boolean;
  assets: DataAsset[];
}

export interface UserTrialsResponse {
  ok: boolean;
  trials: Trial[];
}

export interface UserSubmission extends Submission {
  trial?: {
    id: string;
    title: string;
    rewardUsd: number;
    isOpen: boolean;
  };
}

export interface UserSubmissionsResponse {
  ok: boolean;
  submissions: UserSubmission[];
}
