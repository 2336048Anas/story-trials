// apps/api/src/routes/users.js
import express from "express";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

// Normalize wallet address to lowercase for consistent lookups
const normalizeAddress = (address) => address?.toLowerCase();

// Get user profile by wallet address
router.get("/:address", async (req, res) => {
  try {
    const walletAddress = normalizeAddress(req.params.address);

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        _count: {
          select: {
            assets: true,
            Trial: true,
            submissions: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Normalize the _count field names for frontend
    const normalizedUser = {
      ...user,
      _count: {
        assets: user._count.assets,
        trials: user._count.Trial,
        submissions: user._count.submissions,
      },
    };

    return res.json({ ok: true, user: normalizedUser });
  } catch (err) {
    console.error("get user error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

// Get user's registered assets
router.get("/:address/assets", async (req, res) => {
  try {
    const walletAddress = normalizeAddress(req.params.address);

    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const assets = await prisma.dataAsset.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ ok: true, assets });
  } catch (err) {
    console.error("get user assets error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

// Get trials created by user (as buyer)
router.get("/:address/trials", async (req, res) => {
  try {
    const walletAddress = normalizeAddress(req.params.address);

    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const trials = await prisma.trial.findMany({
      where: { buyerId: user.id },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ ok: true, trials });
  } catch (err) {
    console.error("get user trials error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

// Get user's submissions to trials
router.get("/:address/submissions", async (req, res) => {
  try {
    const walletAddress = normalizeAddress(req.params.address);

    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const submissions = await prisma.submission.findMany({
      where: { userId: user.id },
      include: {
        trial: {
          select: {
            id: true,
            title: true,
            rewardUsd: true,
            isOpen: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ ok: true, submissions });
  } catch (err) {
    console.error("get user submissions error:", err);
    return res
      .status(500)
      .json({ error: "Internal error", details: err.message });
  }
});

export default router;
