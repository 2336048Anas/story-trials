// apps/api/src/routes/assets.js
import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { makeIpfsClient, addJson } from "../lib/ipfs.js";
import { mintAndRegisterIpWithTerms, PILFlavor } from "../lib/story.js";
import { isRealMode } from "../lib/synthetic-guard.js";
import { findOrCreateUserByWallet } from "../lib/user-utils.js";

const router = express.Router();

const RegisterSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  ownerAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid EVM address"),
  ipfsCid: z.string().min(1), // CID of the actual data
  attributes: z
    .array(
      z.object({
        trait_type: z.string(),
        value: z.union([z.string(), z.number(), z.boolean()]),
      })
    )
    .optional(),
  chainId: z.number().optional(),
});

// Quick ping to confirm mount
router.get("/ping", (_req, res) => {
  res.json({ ok: true, where: "assets router" });
});

// List all assets
router.get("/", async (_req, res) => {
  try {
    const assets = await prisma.dataAsset.findMany({
      include: {
        owner: {
          select: {
            id: true,
            walletAddress: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.json({ ok: true, assets });
  } catch (err) {
    console.error("list assets error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

// Get single asset by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const asset = await prisma.dataAsset.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            walletAddress: true,
            name: true,
          },
        },
      },
    });

    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    return res.json({ ok: true, asset });
  } catch (err) {
    console.error("get asset error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid payload", issues: parsed.error.flatten() });
    }
    const { title, description, ownerAddress, ipfsCid, attributes, chainId } =
      parsed.data;

    // 1) Find or create user by wallet address
    const owner = await findOrCreateUserByWallet(ownerAddress, "CONTRIBUTOR");

    // 2) Create metadata for Story Protocol
    const metadata = {
      title,
      description,
      dataCid: ipfsCid, // Reference to actual data
      attributes: attributes || [],
      createdAt: new Date().toISOString(),
      version: "1.0",
      standard: "storytrials-metadata",
    };

    // 3) Pin metadata to IPFS
    const ipfs = makeIpfsClient();
    const metadataCid = await addJson(ipfs, metadata);

    // 4) Register IP asset on Story Protocol (real or mock)
    const chain = chainId ?? Number(process.env.STORY_CHAIN_ID || 1513);

    let ipAssetId, txHash, tokenId, licenseTermsId;

    if (isRealMode()) {
      // Real blockchain: mint NFT + register IP + attach license terms in one tx
      const result = await mintAndRegisterIpWithTerms({
        spgNftContract: process.env.SPG_NFT_CONTRACT,
        licenseTermsData: [
          {
            terms: PILFlavor.nonCommercialSocialRemixing,
          },
        ],
        ipMetadata: {
          ipMetadataURI: metadataCid,
          ipMetadataHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
          nftMetadataURI: metadataCid,
          nftMetadataHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        },
        recipient: ownerAddress,
      });

      ipAssetId = result.ipId;
      txHash = result.txHash;
      tokenId = result.tokenId;
      licenseTermsId = result.licenseTermsIds?.[0] || null;
    } else {
      // Mock mode: generate synthetic identifiers
      const mockRand = Math.random().toString(36).slice(2, 10);
      ipAssetId = `0xmock${mockRand}${"0".repeat(34 - mockRand.length)}`;
      txHash = `0xmock${mockRand}${"0".repeat(58 - mockRand.length)}`;
      tokenId = String(Math.floor(Math.random() * 100000));
      licenseTermsId = "1";
    }

    // 5) Persist in Postgres with correct schema fields
    const asset = await prisma.dataAsset.create({
      data: {
        title,
        description,
        ownerId: owner.id,
        ipfsCid,
        metadataCid,
        ipAssetId: ipAssetId || null,
        storyChainId: chain,
        storyTxHash: txHash || null,
        tokenId: tokenId || null,
        licenseTermsId: licenseTermsId || null,
      },
    });

    // 6) Respond
    const response = {
      ok: true,
      asset,
      owner: { id: owner.id, walletAddress: owner.walletAddress },
      tx: { chainId: chain, ipAssetId, txHash, tokenId, licenseTermsId },
      ipfs: { dataCid: ipfsCid, metadataCid },
    };

    if (isRealMode() && txHash) {
      response.explorerUrl = `https://aeneid.storyscan.io/tx/${txHash}`;
    }
    if (!isRealMode()) {
      response.warning = "SYNTHETIC DATA ONLY - No real blockchain transaction occurred.";
    }

    return res.status(201).json(response);
  } catch (err) {
    console.error("register error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

export default router;

