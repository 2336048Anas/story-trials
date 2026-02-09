#!/usr/bin/env node
// setup-spg.mjs — Deploy an SPG NFT collection on Story Protocol (Aeneid testnet)
//
// Usage:
//   node scripts/setup-spg.mjs
//
// Required env vars:
//   STORY_PRIVATE_KEY  — hex private key (0x...)
//   STORY_RPC_URL      — (optional, defaults to https://aeneid.storyrpc.io)

import "dotenv/config";
import { StoryClient } from "@story-protocol/core-sdk";
import { http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const privateKey = process.env.STORY_PRIVATE_KEY;
if (!privateKey) {
  console.error("Error: STORY_PRIVATE_KEY environment variable is required.");
  process.exit(1);
}

const rpcUrl = process.env.STORY_RPC_URL || "https://aeneid.storyrpc.io";

console.log("Initializing Story Protocol client...");
const account = privateKeyToAccount(privateKey);
console.log(`Wallet address: ${account.address}`);

const client = StoryClient.newClientUseAccount({
  account,
  transport: http(rpcUrl),
  chainId: "aeneid",
});

console.log("Deploying SPG NFT collection...");

const result = await client.nftClient.createNFTCollection({
  name: "Story Trials Data Assets",
  symbol: "STDA",
  isPublicMinting: true,
  mintOpen: true,
  mintFeeRecipient: account.address,
  contractURI: "",
  txOptions: { waitForTransaction: true },
});

console.log("\nSPG NFT Collection deployed successfully!");
console.log(`  Transaction hash: ${result.txHash}`);
console.log(`  SPG NFT contract: ${result.spgNftContract}`);
console.log("\nAdd this to your .env file:");
console.log(`  SPG_NFT_CONTRACT=${result.spgNftContract}`);
