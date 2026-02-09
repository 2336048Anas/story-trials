// apps/api/src/routes/payments.js
import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { payRoyalty, claimRevenue, checkClaimableRevenue } from "../lib/story.js";
import { syntheticOnlyMiddleware, isRealMode, validateSyntheticAmount } from "../lib/synthetic-guard.js";

const router = express.Router();

const CreatePaymentSchema = z.object({
  licenseId: z.string().min(1),
  amount: z.number().int().min(0), // cents - synthetic demo value
  currency: z.enum(["USD", "EUR", "GBP"]).default("USD"),
  chainTx: z.string().optional(), // optional mock chain tx
});

// CRITICAL: All payment operations require synthetic-only guard
router.post("/", syntheticOnlyMiddleware, async (req, res) => {
  try {
    const parsed = CreatePaymentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid payload", issues: parsed.error.flatten() });
    }

    const { licenseId, amount, currency, chainTx } = parsed.data;

    // Validate synthetic amount safeguard
    validateSyntheticAmount(amount);

    // Check license exists
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: { asset: true },
    });

    if (!license) {
      return res.status(404).json({ error: "License not found" });
    }

    // Create synthetic payment record
    const payment = await prisma.payment.create({
      data: {
        licenseId,
        amount,
        currency,
        chainTx,
      },
    });

    return res.status(201).json({
      ok: true,
      payment,
      warning: "SYNTHETIC DATA ONLY - No real financial transaction occurred.",
    });
  } catch (err) {
    console.error("create payment error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

// Create royalty event (also guarded)
const CreateRoyaltySchema = z.object({
  licenseId: z.string().min(1),
  recipientId: z.string().min(1),
  amount: z.number().int().min(0),
  currency: z.enum(["USD", "EUR", "GBP"]).default("USD"),
  note: z.string().optional(),
});

router.post("/royalties", async (req, res, next) => {
  // Skip synthetic guard in real blockchain mode
  if (!isRealMode()) return syntheticOnlyMiddleware(req, res, next);
  next();
}, async (req, res) => {
  try {
    const parsed = CreateRoyaltySchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid payload", issues: parsed.error.flatten() });
    }

    const { licenseId, recipientId, amount, currency, note } = parsed.data;

    let chainTxHash = null;

    if (isRealMode()) {
      // Look up the license and its asset to get ipAssetId
      const license = await prisma.license.findUnique({
        where: { id: licenseId },
        include: { asset: true },
      });
      if (!license) {
        return res.status(404).json({ error: "License not found" });
      }
      if (!license.asset.ipAssetId) {
        return res.status(400).json({
          error: "Asset has no IP Asset ID - cannot pay royalty on-chain.",
        });
      }

      const result = await payRoyalty({
        receiverIpId: license.asset.ipAssetId,
        payerIpId: "0x0000000000000000000000000000000000000000", // platform pays
        amount: BigInt(amount),
      });
      chainTxHash = result.txHash;
    } else {
      // Validate synthetic amount
      validateSyntheticAmount(amount);
    }

    const royalty = await prisma.royaltyEvent.create({
      data: {
        licenseId,
        recipientId,
        amount,
        currency,
        note: chainTxHash ? `${note || ""} [tx: ${chainTxHash}]`.trim() : note,
      },
    });

    const response = {
      ok: true,
      royalty,
    };

    if (isRealMode() && chainTxHash) {
      response.explorerUrl = `https://aeneid.storyscan.io/tx/${chainTxHash}`;
    }
    if (!isRealMode()) {
      response.warning = "SYNTHETIC DATA ONLY - No real financial transaction occurred.";
    }

    return res.status(201).json(response);
  } catch (err) {
    console.error("create royalty error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

// Check claimable revenue for an IP asset
router.get("/royalties/claimable", async (req, res) => {
  try {
    const { ipId, claimer, token } = req.query;
    if (!ipId || !claimer) {
      return res.status(400).json({
        error: "ipId and claimer query params are required",
      });
    }

    if (!isRealMode()) {
      return res.json({
        ok: true,
        claimableAmount: "0",
        warning: "SYNTHETIC DATA ONLY - No real claimable revenue in mock mode.",
      });
    }

    const result = await checkClaimableRevenue({
      ipId,
      claimer,
      token: token || undefined,
    });

    return res.json({
      ok: true,
      claimableAmount: result.claimableAmount,
    });
  } catch (err) {
    console.error("check claimable revenue error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

// Claim accumulated revenue for an IP asset
const ClaimRevenueSchema = z.object({
  ancestorIpId: z.string().min(1),
  claimer: z.string().min(1),
  childIpIds: z.array(z.string()),
  royaltyPolicies: z.array(z.string()),
  currencyTokens: z.array(z.string()),
});

router.post("/royalties/claim", async (req, res) => {
  try {
    if (!isRealMode()) {
      return res.json({
        ok: true,
        txHashes: [],
        claimedTokens: [],
        warning: "SYNTHETIC DATA ONLY - No real claim in mock mode.",
      });
    }

    const parsed = ClaimRevenueSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid payload", issues: parsed.error.flatten() });
    }

    const { ancestorIpId, claimer, childIpIds, royaltyPolicies, currencyTokens } =
      parsed.data;

    const result = await claimRevenue({
      ancestorIpId,
      claimer,
      childIpIds,
      royaltyPolicies,
      currencyTokens,
    });

    const response = {
      ok: true,
      txHashes: result.txHashes,
      claimedTokens: result.claimedTokens,
    };

    if (result.txHashes?.[0]) {
      response.explorerUrl = `https://aeneid.storyscan.io/tx/${result.txHashes[0]}`;
    }

    return res.json(response);
  } catch (err) {
    console.error("claim revenue error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

// List royalty events for a recipient
router.get("/royalties", async (req, res) => {
  try {
    const { recipientId } = req.query;
    if (!recipientId) {
      return res.status(400).json({ error: "recipientId query param required" });
    }

    const royalties = await prisma.royaltyEvent.findMany({
      where: { recipientId },
      include: {
        license: {
          include: { asset: { select: { id: true, title: true } } },
        },
        payout: { select: { id: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      ok: true,
      royalties,
      warning: "SYNTHETIC DATA ONLY - No real financial transaction occurred.",
    });
  } catch (err) {
    console.error("list royalties error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

// List payouts for a recipient
router.get("/payouts", async (req, res) => {
  try {
    const { recipientId } = req.query;
    if (!recipientId) {
      return res.status(400).json({ error: "recipientId query param required" });
    }

    const payouts = await prisma.payout.findMany({
      where: { recipientId },
      include: {
        events: {
          select: { id: true, amount: true, currency: true, licenseId: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      ok: true,
      payouts,
      warning: "SYNTHETIC DATA ONLY - No real financial transaction occurred.",
    });
  } catch (err) {
    console.error("list payouts error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

export default router;
