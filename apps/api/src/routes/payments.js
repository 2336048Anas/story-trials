// apps/api/src/routes/payments.js
import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { syntheticOnlyMiddleware, validateSyntheticAmount } from "../lib/synthetic-guard.js";

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

router.post("/royalties", syntheticOnlyMiddleware, async (req, res) => {
  try {
    const parsed = CreateRoyaltySchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid payload", issues: parsed.error.flatten() });
    }

    const { licenseId, recipientId, amount, currency, note } = parsed.data;

    // Validate synthetic amount
    validateSyntheticAmount(amount);

    const royalty = await prisma.royaltyEvent.create({
      data: {
        licenseId,
        recipientId,
        amount,
        currency,
        note,
      },
    });

    return res.status(201).json({
      ok: true,
      royalty,
      warning: "SYNTHETIC DATA ONLY - No real financial transaction occurred.",
    });
  } catch (err) {
    console.error("create royalty error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

export default router;
