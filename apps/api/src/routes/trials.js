// apps/api/src/routes/trials.js
import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { syntheticOnlyMiddleware, validateSyntheticAmount } from "../lib/synthetic-guard.js";
import { findOrCreateUserByWallet } from "../lib/user-utils.js";

const router = express.Router();

const CreateTrialSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  rewardUsd: z.number().int().min(0), // cents - synthetic demo value
  buyerId: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid EVM address"), // wallet address
});

const UpdateTrialSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  isOpen: z.boolean().optional(),
});

const CreateSubmissionSchema = z.object({
  userId: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid EVM address"), // wallet address
  dataCid: z.string().min(1),
  assetId: z.string().optional(),
});

const UpdateSubmissionSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
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

    const { title, description, rewardUsd, buyerId: walletAddress } = parsed.data;

    // Validate synthetic amount (prevent real-world payment amounts)
    validateSyntheticAmount(rewardUsd);

    // Get or create user from wallet address
    const buyer = await findOrCreateUserByWallet(walletAddress);

    const trial = await prisma.trial.create({
      data: {
        title,
        description,
        rewardUsd,
        buyerId: buyer.id,
      },
      include: {
        buyer: {
          select: { id: true, name: true, walletAddress: true },
        },
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

// Get single trial by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const trial = await prisma.trial.findUnique({
      where: { id },
      include: {
        buyer: {
          select: { id: true, name: true, walletAddress: true },
        },
        _count: {
          select: { submissions: true },
        },
      },
    });

    if (!trial) {
      return res.status(404).json({ error: "Trial not found" });
    }

    return res.json({ ok: true, trial });
  } catch (err) {
    console.error("get trial error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

// Update trial (close, edit)
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const parsed = UpdateTrialSchema.safeParse(req.body);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid payload", issues: parsed.error.flatten() });
    }

    const trial = await prisma.trial.update({
      where: { id },
      data: parsed.data,
    });

    return res.json({ ok: true, trial });
  } catch (err) {
    console.error("update trial error:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Trial not found" });
    }
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

// Create submission for a trial
router.post("/:id/submissions", async (req, res) => {
  try {
    const { id: trialId } = req.params;
    const parsed = CreateSubmissionSchema.safeParse(req.body);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid payload", issues: parsed.error.flatten() });
    }

    // Check trial exists and is open
    const trial = await prisma.trial.findUnique({
      where: { id: trialId },
    });

    if (!trial) {
      return res.status(404).json({ error: "Trial not found" });
    }

    if (!trial.isOpen) {
      return res.status(400).json({ error: "Trial is closed" });
    }

    const { userId: walletAddress, dataCid, assetId } = parsed.data;

    // Get or create user from wallet address
    const user = await findOrCreateUserByWallet(walletAddress);

    const submission = await prisma.submission.create({
      data: {
        trialId,
        userId: user.id,
        dataCid,
        assetId,
        status: "PENDING",
      },
      include: {
        user: {
          select: { id: true, name: true, walletAddress: true },
        },
        asset: true,
      },
    });

    return res.status(201).json({ ok: true, submission });
  } catch (err) {
    console.error("create submission error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

// List submissions for a trial
router.get("/:id/submissions", async (req, res) => {
  try {
    const { id: trialId } = req.params;

    // Check trial exists
    const trial = await prisma.trial.findUnique({
      where: { id: trialId },
    });

    if (!trial) {
      return res.status(404).json({ error: "Trial not found" });
    }

    const submissions = await prisma.submission.findMany({
      where: { trialId },
      include: {
        user: {
          select: { id: true, name: true, walletAddress: true },
        },
        asset: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ ok: true, submissions });
  } catch (err) {
    console.error("list submissions error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

// Update submission status (approve/reject)
router.patch("/:id/submissions/:submissionId", syntheticOnlyMiddleware, async (req, res) => {
  try {
    const { id: trialId, submissionId } = req.params;
    const parsed = UpdateSubmissionSchema.safeParse(req.body);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid payload", issues: parsed.error.flatten() });
    }

    // Verify submission belongs to trial
    const existing = await prisma.submission.findFirst({
      where: { id: submissionId, trialId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Submission not found" });
    }

    const submission = await prisma.submission.update({
      where: { id: submissionId },
      data: { status: parsed.data.status },
      include: {
        user: {
          select: { id: true, name: true, walletAddress: true },
        },
        asset: true,
      },
    });

    return res.json({
      ok: true,
      submission,
      note: "Payment processing is synthetic demonstration only - no real payments occur.",
    });
  } catch (err) {
    console.error("update submission error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

export default router;
