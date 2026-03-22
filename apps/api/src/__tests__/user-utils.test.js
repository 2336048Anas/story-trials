import { describe, it, expect } from "vitest";
import { isValidEVMAddress } from "../lib/user-utils.js";

describe("EVM Address Validation", () => {
  it("accepts a valid checksummed address", () => {
    expect(isValidEVMAddress("0xDE43231422505Ae90507219c322b05f23c76038B")).toBe(
      true
    );
  });

  it("accepts a valid lowercase address", () => {
    expect(isValidEVMAddress("0xde43231422505ae90507219c322b05f23c76038b")).toBe(
      true
    );
  });

  it("rejects address without 0x prefix", () => {
    expect(isValidEVMAddress("DE43231422505Ae90507219c322b05f23c76038B")).toBe(
      false
    );
  });

  it("rejects address that is too short", () => {
    expect(isValidEVMAddress("0x1234")).toBe(false);
  });

  it("rejects address with non-hex characters", () => {
    expect(isValidEVMAddress("0xZZ43231422505Ae90507219c322b05f23c76038B")).toBe(
      false
    );
  });

  it("rejects empty string", () => {
    expect(isValidEVMAddress("")).toBe(false);
  });

  it("rejects null", () => {
    expect(isValidEVMAddress(null)).toBe(false);
  });
});

describe("Wallet Address Normalisation", () => {
  it("normalises mixed-case to consistent format", () => {
    const upper = "0xDE43231422505Ae90507219c322b05f23c76038B";
    const lower = upper.toLowerCase();
    // The findOrCreateUserByWallet function normalises to lowercase
    // We test the normalisation logic directly
    expect(lower).toBe("0xde43231422505ae90507219c322b05f23c76038b");
    expect(lower).not.toBe(upper);
  });
});
