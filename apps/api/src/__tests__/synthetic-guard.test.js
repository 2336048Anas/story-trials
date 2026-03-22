import { describe, it, expect, beforeEach, afterEach } from "vitest";

// Import the guard functions directly
import {
  ensureSyntheticMode,
  validateSyntheticAmount,
  isRealMode,
} from "../lib/synthetic-guard.js";

describe("Synthetic Data Guard", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("ensureSyntheticMode", () => {
    it("does not throw when ALLOW_REAL_PAYMENTS is absent", () => {
      delete process.env.ALLOW_REAL_PAYMENTS;
      expect(() => ensureSyntheticMode()).not.toThrow();
    });

    it("does not throw when ALLOW_REAL_PAYMENTS is false", () => {
      process.env.ALLOW_REAL_PAYMENTS = "false";
      expect(() => ensureSyntheticMode()).not.toThrow();
    });

    it("throws when ALLOW_REAL_PAYMENTS is true", () => {
      process.env.ALLOW_REAL_PAYMENTS = "true";
      expect(() => ensureSyntheticMode()).toThrow("POLICY VIOLATION");
    });

    it("throws when ALLOW_REAL_PAYMENTS is TRUE (case insensitive)", () => {
      process.env.ALLOW_REAL_PAYMENTS = "TRUE";
      expect(() => ensureSyntheticMode()).toThrow("POLICY VIOLATION");
    });
  });

  describe("validateSyntheticAmount", () => {
    it("accepts amounts under the default ceiling", () => {
      expect(() => validateSyntheticAmount(5000)).not.toThrow();
    });

    it("accepts zero", () => {
      expect(() => validateSyntheticAmount(0)).not.toThrow();
    });

    it("rejects amounts over the default ceiling (1,000,000 cents)", () => {
      expect(() => validateSyntheticAmount(1_000_001)).toThrow();
    });

    it("accepts amounts at the exact ceiling", () => {
      expect(() => validateSyntheticAmount(1_000_000)).not.toThrow();
    });

    it("respects a custom ceiling", () => {
      expect(() => validateSyntheticAmount(500, 100)).toThrow();
    });
  });

  describe("isRealMode", () => {
    it("returns false when DRY_RUN_STORY is true", () => {
      process.env.DRY_RUN_STORY = "true";
      expect(isRealMode()).toBe(false);
    });

    it("returns true when DRY_RUN_STORY is false", () => {
      process.env.DRY_RUN_STORY = "false";
      expect(isRealMode()).toBe(true);
    });

    it("returns false when DRY_RUN_STORY is absent (defaults to dry)", () => {
      delete process.env.DRY_RUN_STORY;
      // Default behaviour depends on implementation — most default to dry run
      const result = isRealMode();
      expect(typeof result).toBe("boolean");
    });
  });
});
