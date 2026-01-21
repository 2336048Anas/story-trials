// apps/api/src/lib/user-utils.js
import { prisma } from "./prisma.js";

/**
 * Find or create a user by their wallet address.
 * Used when contributors/buyers interact with the system via wallet.
 */
export async function findOrCreateUserByWallet(walletAddress, defaultRole = "CONTRIBUTOR") {
  if (!walletAddress) {
    throw new Error("Wallet address is required");
  }

  // Normalize to lowercase for case-insensitive lookup
  const normalized = walletAddress.toLowerCase();

  // Try to find existing user
  console.log("DEBUG: prisma =", typeof prisma, "prisma.user =", typeof prisma?.user);
  let user = await prisma.user.findUnique({
    where: { walletAddress: normalized },
  });

  // Create if doesn't exist
  if (!user) {
    user = await prisma.user.create({
      data: {
        walletAddress: normalized,
        role: defaultRole,
      },
    });
  }

  return user;
}

/**
 * Validate EVM address format
 */
export function isValidEVMAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
