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
