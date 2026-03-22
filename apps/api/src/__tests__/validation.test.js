import { describe, it, expect } from "vitest";
import { z } from "zod";

// Replicate the RegisterSchema from routes/assets.js
const RegisterSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  ownerAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid EVM address"),
  ipfsCid: z.string().min(1),
  attributes: z
    .array(
      z.object({
        trait_type: z.string(),
        value: z.union([z.string(), z.number(), z.boolean()]),
      })
    )
    .optional(),
  chainId: z.number().optional(),
});

describe("RegisterSchema validation", () => {
  const validPayload = {
    title: "Synthetic Oncology Dataset",
    ownerAddress: "0xDE43231422505Ae90507219c322b05f23c76038B",
    ipfsCid: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
  };

  it("accepts a valid registration payload", () => {
    const result = RegisterSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("accepts payload with optional fields", () => {
    const result = RegisterSchema.safeParse({
      ...validPayload,
      description: "Test dataset for oncology research",
      attributes: [{ trait_type: "category", value: "oncology" }],
      chainId: 1315,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = RegisterSchema.safeParse({ ...validPayload, title: "" });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.title).toBeDefined();
  });

  it("rejects missing title", () => {
    const { title, ...noTitle } = validPayload;
    const result = RegisterSchema.safeParse(noTitle);
    expect(result.success).toBe(false);
  });

  it("rejects invalid EVM address — too short", () => {
    const result = RegisterSchema.safeParse({
      ...validPayload,
      ownerAddress: "0x1234",
    });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.ownerAddress).toBeDefined();
  });

  it("rejects invalid EVM address — no 0x prefix", () => {
    const result = RegisterSchema.safeParse({
      ...validPayload,
      ownerAddress: "DE43231422505Ae90507219c322b05f23c76038B",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid EVM address — non-hex characters", () => {
    const result = RegisterSchema.safeParse({
      ...validPayload,
      ownerAddress: "0xZZ43231422505Ae90507219c322b05f23c76038B",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty IPFS CID", () => {
    const result = RegisterSchema.safeParse({ ...validPayload, ipfsCid: "" });
    expect(result.success).toBe(false);
  });

  it("rejects completely empty body", () => {
    const result = RegisterSchema.safeParse({});
    expect(result.success).toBe(false);
    const errors = result.error.flatten().fieldErrors;
    expect(errors.title).toBeDefined();
    expect(errors.ownerAddress).toBeDefined();
    expect(errors.ipfsCid).toBeDefined();
  });
});
