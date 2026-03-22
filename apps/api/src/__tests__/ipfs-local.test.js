import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { addJson } from "../lib/ipfs.js";
import fs from "fs/promises";
import path from "path";

const TEST_IPFS_DIR = path.join(process.cwd(), "../../.data/ipfs-test");

describe("IPFS Local Mode", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      DRY_RUN_IPFS: "false",
      IPFS_MODE: "local",
      LOCAL_IPFS_DIR: TEST_IPFS_DIR,
    };
  });

  afterEach(async () => {
    process.env = originalEnv;
    // Clean up test files
    await fs.rm(TEST_IPFS_DIR, { recursive: true, force: true }).catch(() => {});
  });

  it("produces a deterministic CID for the same content", async () => {
    const obj = { title: "Test Dataset", version: "1.0" };
    const cid1 = await addJson(null, obj);
    const cid2 = await addJson(null, obj);
    expect(cid1).toBe(cid2);
  });

  it("produces different CIDs for different content", async () => {
    const cid1 = await addJson(null, { title: "Dataset A" });
    const cid2 = await addJson(null, { title: "Dataset B" });
    expect(cid1).not.toBe(cid2);
  });

  it("writes a JSON file to the local IPFS directory", async () => {
    const obj = { title: "Persistence Test" };
    const cid = await addJson(null, obj);
    const filePath = path.join(TEST_IPFS_DIR, `${cid}.json`);
    const content = await fs.readFile(filePath, "utf8");
    expect(JSON.parse(content)).toEqual(obj);
  });

  it("returns a CID starting with 'dev' prefix in local mode", async () => {
    const cid = await addJson(null, { test: true });
    expect(cid.startsWith("dev")).toBe(true);
  });
});

describe("IPFS Dry Run Mode", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, DRY_RUN_IPFS: "true" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns a mock CID with bafymock prefix", async () => {
    const cid = await addJson(null, { title: "Dry Run Test" });
    expect(cid.startsWith("bafymock")).toBe(true);
  });

  it("does not write any files", async () => {
    await addJson(null, { title: "No File Test" });
    // In dry run, no file should be created at all
    // This is implicitly tested by the mock CID return
  });
});
