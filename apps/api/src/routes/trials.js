// apps/api/src/routes/trials.js
import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { syntheticOnlyMiddleware, validateSyntheticAmount } from "../lib/synthetic-guard.js";

const router = express.Router();

const CreateTrialSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  rewardUsd: z.number().int().min(0), // cents - synthetic demo value
  buyerId: z.string().min(1),
});

// Apply synthetic-only guard to all trial creation (involves reward amounts)
router.post("/", syntheticOnlyMiddleware, async (req, res) => {
  try {
    const parsed = CreateTrialSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid payload", issues: parsed.error.flatten() });
    }

    const { title, description, rewardUsd, buyerId } = parsed.data;

    // Validate synthetic amount (prevent real-world payment amounts)
    validateSyntheticAmount(rewardUsd);

    const trial = await prisma.trial.create({
      data: {
        title,
        description,
        rewardUsd,
        buyerId,
      },
    });

    return res.status(201).json({
      ok: true,
      trial,
      note: "Reward amount is synthetic demonstration data only - no real payments occur.",
    });
  } catch (err) {
    console.error("create trial error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

// List trials
router.get("/", async (req, res) => {
  try {
    const trials = await prisma.trial.findMany({
      where: { isOpen: true },
      include: {
        buyer: {
          select: { id: true, name: true, walletAddress: true },
        },
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ ok: true, trials });
  } catch (err) {
    console.error("list trials error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

export default router;
