// synthetic-guard.js
// Safeguards to ensure payment operations remain synthetic-only

/**
 * Validates that the system is in synthetic-only mode.
 * Throws an error if real payment operations are attempted.
 */
export function ensureSyntheticMode() {
  const allowRealPayments = String(
    process.env.ALLOW_REAL_PAYMENTS || "false"
  ).toLowerCase() === "true";

  if (allowRealPayments) {
    throw new Error(
      "POLICY VIOLATION: Real payment operations are not permitted. " +
      "This system uses synthetic data only for educational/demonstration purposes. " +
      "Set ALLOW_REAL_PAYMENTS=false or remove the variable."
    );
  }
}

/**
 * Middleware to guard payment-related routes.
 * Use this on any endpoint that creates Payment, RoyaltyEvent, or Payout records.
 */
export function syntheticOnlyMiddleware(req, res, next) {
  try {
    ensureSyntheticMode();
    next();
  } catch (error) {
    return res.status(403).json({
      ok: false,
      error: "Payment operation not permitted",
      message: error.message,
    });
  }
}

/**
 * Validates payment amounts are reasonable for synthetic demo data.
 * Prevents accidentally using real-world large amounts.
 */
export function validateSyntheticAmount(amount, maxCents = 1000000) {
  if (typeof amount !== "number" || amount < 0) {
    throw new Error("Invalid amount: must be a non-negative number");
  }

  if (amount > maxCents) {
    throw new Error(
      `Amount ${amount} cents exceeds synthetic demo limit of ${maxCents} cents. ` +
      "This safeguard prevents real-world payment amounts in a synthetic-only system."
    );
  }

  return true;
}
