// Toggle mock vs real with DRY_RUN_STORY=true (default)
const DRY = String(process.env.DRY_RUN_STORY || "true").toLowerCase() === "true";

// Keep this function's shape stable so you can swap implementations later
export async function registerIpAsset({ owner, metadataCid, chainId }) {
  if (DRY) {
    // deterministic-ish mock
    const rand = Math.random().toString(36).slice(2, 10);
    return {
      ipAssetId: `mock-ip-${rand}`,
      txHash: `0xmocktx${rand}`,
      owner,
      metadataCid,
      chainId,
    };
  }

  // Real SDK hookup (sketch; fill in later)
  // import { StoryClient } from "@story-protocol/core-sdk";
  // const client = new StoryClient({
  //   rpcUrl: process.env.STORY_RPC_URL,
  //   privateKey: process.env.STORY_PRIVATE_KEY,
  // });
  // const { ipId, txHash } = await client.ipAsset.register({ owner, metadataCid });
  // return { ipAssetId: ipId, txHash, owner, metadataCid, chainId };

  throw new Error("Real Story SDK not wired yet. Set DRY_RUN_STORY=true for now.");
}
