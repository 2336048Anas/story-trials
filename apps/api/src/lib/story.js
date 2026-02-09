// story.js — Story Protocol SDK client layer
// Toggle mock vs real with DRY_RUN_STORY=true (default)

import { StoryClient, WIP_TOKEN_ADDRESS, PILFlavor } from "@story-protocol/core-sdk";
import { http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const DRY = String(process.env.DRY_RUN_STORY || "true").toLowerCase() === "true";

// --------------- lazy singleton client ---------------

let _client = null;

function getStoryClient() {
  if (_client) return _client;

  const privateKey = process.env.STORY_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("STORY_PRIVATE_KEY is required when DRY_RUN_STORY=false");
  }

  const rpcUrl = process.env.STORY_RPC_URL || "https://aeneid.storyrpc.io";

  _client = StoryClient.newClientUseAccount({
    account: privateKeyToAccount(privateKey),
    transport: http(rpcUrl),
    chainId: "aeneid",
  });

  return _client;
}

// --------------- helpers ---------------

function mockHash() {
  const rand = Math.random().toString(36).slice(2, 10);
  return `0xmock${rand}${"0".repeat(58 - rand.length)}`;
}

function mockAddress() {
  const rand = Math.random().toString(36).slice(2, 10);
  return `0xmock${rand}${"0".repeat(34 - rand.length)}`;
}

// --------------- exported SDK functions ---------------

/**
 * Register an existing NFT as an IP Asset on Story Protocol.
 */
export async function registerIpAsset({ nftContract, tokenId, metadataCid }) {
  if (DRY) {
    return {
      ipId: mockAddress(),
      tokenId: String(tokenId),
      txHash: mockHash(),
    };
  }

  const client = getStoryClient();
  const result = await client.ipAsset.register({
    nftContract,
    tokenId,
    ipMetadata: {
      ipMetadataURI: metadataCid,
      ipMetadataHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      nftMetadataURI: metadataCid,
      nftMetadataHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    },
    txOptions: { waitForTransaction: true },
  });

  return {
    ipId: result.ipId,
    tokenId: String(tokenId),
    txHash: result.txHash,
  };
}

/**
 * Mint an NFT, register it as an IP Asset, and attach PIL terms in one transaction.
 */
export async function mintAndRegisterIpWithTerms({
  spgNftContract,
  licenseTermsData,
  ipMetadata,
  recipient,
}) {
  if (DRY) {
    return {
      ipId: mockAddress(),
      tokenId: String(Math.floor(Math.random() * 100000)),
      txHash: mockHash(),
      licenseTermsIds: ["1"],
    };
  }

  const client = getStoryClient();
  const spg = spgNftContract || process.env.SPG_NFT_CONTRACT;
  if (!spg) {
    throw new Error("SPG_NFT_CONTRACT is required for mintAndRegisterIpWithTerms");
  }

  const result = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
    spgNftContract: spg,
    licenseTermsData,
    ipMetadata,
    ...(recipient && { recipient }),
    txOptions: { waitForTransaction: true },
  });

  return {
    ipId: result.ipId,
    tokenId: result.tokenId != null ? String(result.tokenId) : undefined,
    txHash: result.txHash,
    licenseTermsIds: result.licenseTermsIds?.map(String),
  };
}

/**
 * Attach license terms to an existing IP Asset.
 */
export async function attachLicenseTerms({ ipId, licenseTermsId }) {
  if (DRY) {
    return { txHash: mockHash(), success: true };
  }

  const client = getStoryClient();
  const result = await client.license.attachLicenseTerms({
    ipId,
    licenseTermsId,
    txOptions: { waitForTransaction: true },
  });

  return {
    txHash: result.txHash,
    success: result.success,
  };
}

/**
 * Mint license tokens for a given IP Asset + license terms pair.
 */
export async function mintLicenseTokens({
  licensorIpId,
  licenseTermsId,
  amount = 1,
  receiver,
  maxMintingFee = 0,
  maxRevenueShare = 100,
}) {
  if (DRY) {
    return {
      licenseTokenIds: [String(Math.floor(Math.random() * 100000))],
      txHash: mockHash(),
    };
  }

  const client = getStoryClient();
  const result = await client.license.mintLicenseTokens({
    licensorIpId,
    licenseTermsId,
    amount,
    ...(receiver && { receiver }),
    maxMintingFee,
    maxRevenueShare,
    txOptions: { waitForTransaction: true },
  });

  return {
    licenseTokenIds: result.licenseTokenIds?.map(String),
    txHash: result.txHash,
  };
}

/**
 * Pay royalties on behalf of a payer IP to a receiver IP.
 */
export async function payRoyalty({
  receiverIpId,
  payerIpId,
  token,
  amount,
}) {
  if (DRY) {
    return { txHash: mockHash() };
  }

  const client = getStoryClient();
  const result = await client.royalty.payRoyaltyOnBehalf({
    receiverIpId,
    payerIpId,
    token: token || WIP_TOKEN_ADDRESS,
    amount,
    txOptions: { waitForTransaction: true },
  });

  return { txHash: result.txHash };
}

/**
 * Claim all accumulated revenue for an ancestor IP.
 */
export async function claimRevenue({
  ancestorIpId,
  claimer,
  childIpIds,
  royaltyPolicies,
  currencyTokens,
}) {
  if (DRY) {
    return { txHashes: [mockHash()], claimedTokens: [] };
  }

  const client = getStoryClient();
  const result = await client.royalty.claimAllRevenue({
    ancestorIpId,
    claimer,
    childIpIds,
    royaltyPolicies,
    currencyTokens,
  });

  return {
    txHashes: result.txHashes,
    claimedTokens: result.claimedTokens,
  };
}

/**
 * Check claimable revenue for a given IP, claimer, and token.
 */
export async function checkClaimableRevenue({ ipId, claimer, token }) {
  if (DRY) {
    return { claimableAmount: "0" };
  }

  const client = getStoryClient();
  const amount = await client.royalty.claimableRevenue({
    ipId,
    claimer,
    token: token || WIP_TOKEN_ADDRESS,
  });

  return { claimableAmount: String(amount) };
}

// Re-export useful constants for consumers
export { getStoryClient, WIP_TOKEN_ADDRESS, PILFlavor, DRY as DRY_RUN };
