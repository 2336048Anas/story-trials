// apps/api/src/routes/licenses.js
import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { mintLicenseTokens } from "../lib/story.js";
import { isRealMode } from "../lib/synthetic-guard.js";
import { findOrCreateUserByWallet } from "../lib/user-utils.js";

const router = express.Router();

// List licenses (optionally filter by buyerId)
router.get("/", async (req, res) => {
  try {
    const where = {};
    if (req.query.buyerId) {
      where.buyerId = req.query.buyerId;
    }

    const licenses = await prisma.license.findMany({
      where,
      include: {
        asset: {
          select: {
            id: true,
            title: true,
            description: true,
            ipfsCid: true,
            isListed: true,
            owner: {
              select: {
                id: true,
                walletAddress: true,
                name: true,
              },
            },
          },
        },
        buyer: {
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

    return res.json({ ok: true, licenses });
  } catch (err) {
    console.error("list licenses error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

// Get single license by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const license = await prisma.license.findUnique({
      where: { id },
      include: {
        asset: {
          select: {
            id: true,
            title: true,
            description: true,
            ipfsCid: true,
            metadataCid: true,
            isListed: true,
            ipAssetId: true,
            storyChainId: true,
            owner: {
              select: {
                id: true,
                walletAddress: true,
                name: true,
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            walletAddress: true,
            name: true,
          },
        },
        payment: true,
        royalties: {
          include: {
            recipient: {
              select: {
                id: true,
                walletAddress: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!license) {
      return res.status(404).json({ error: "License not found" });
    }

    return res.json({ ok: true, license });
  } catch (err) {
    console.error("get license error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

// Create a license for an asset
const CreateLicenseSchema = z.object({
  assetId: z.string().min(1),
  buyerAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid EVM address"),
  expiresAt: z.string().datetime().optional(),
});

router.post("/", async (req, res) => {
  try {
    const parsed = CreateLicenseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid payload", issues: parsed.error.flatten() });
    }

    const { assetId, buyerAddress, expiresAt } = parsed.data;

    // Verify asset exists
    const asset = await prisma.dataAsset.findUnique({
      where: { id: assetId },
    });
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    // Find or create buyer
    const buyer = await findOrCreateUserByWallet(buyerAddress, "BUYER");

    // Mint license token on-chain if in real mode
    let txHash = null;
    let chainLicenseId = null;

    if (isRealMode()) {
      if (!asset.ipAssetId) {
        return res.status(400).json({
          error: "Asset has no IP Asset ID - it must be registered on-chain first.",
        });
      }
      if (!asset.termsRef) {
        return res.status(400).json({
          error: "Asset has no license terms - it must have terms attached first.",
        });
      }

      const result = await mintLicenseTokens({
        licensorIpId: asset.ipAssetId,
        licenseTermsId: asset.termsRef,
        amount: 1,
        receiver: buyerAddress,
        maxMintingFee: 0,
        maxRevenueShare: 100,
      });

      txHash = result.txHash;
      chainLicenseId = result.licenseTokenIds?.[0] || null;
    }

    // Create the license record
    const license = await prisma.license.create({
      data: {
        assetId,
        buyerId: buyer.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        txHash,
        chainLicenseId,
      },
      include: {
        asset: {
          select: {
            id: true,
            title: true,
            owner: {
              select: {
                id: true,
                walletAddress: true,
                name: true,
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            walletAddress: true,
            name: true,
          },
        },
      },
    });

    const response = {
      ok: true,
      license,
    };

    if (isRealMode() && txHash) {
      response.explorerUrl = `https://aeneid.storyscan.io/tx/${txHash}`;
    }
    if (!isRealMode()) {
      response.warning = "SYNTHETIC DATA ONLY - No real licensing transaction occurred.";
    }

    return res.status(201).json(response);
  } catch (err) {
    console.error("create license error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

export default router;
