// apps/api/src/routes/assets.js
import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { makeIpfsClient, addJson } from "../lib/ipfs.js";
import { registerIpAsset } from "../lib/story.js";
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

    // 4) Register IP asset on Story Protocol (mock or real)
    const chain = chainId ?? Number(process.env.STORY_CHAIN_ID || 1513);
    const { ipAssetId, txHash } = await registerIpAsset({
      owner: ownerAddress,
      metadataCid,
      chainId: chain,
    });

    // 5) Persist in Postgres with correct schema fields
    const asset = await prisma.dataAsset.create({
      data: {
        title,
        description,
        ownerId: owner.id, // User ID, not wallet address
        ipfsCid, // The actual data CID
        metadataCid, // The metadata CID
        ipAssetId: ipAssetId || null,
        storyChainId: chain,
        storyTxHash: txHash || null,
      },
    });

    // 6) Respond
    return res.status(201).json({
      ok: true,
      asset,
      owner: { id: owner.id, walletAddress: owner.walletAddress },
      tx: { chainId: chain, ipAssetId, txHash },
      ipfs: { dataCid: ipfsCid, metadataCid },
    });
  } catch (err) {
    console.error("register error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

export default router;

