// ESM
import { create } from "ipfs-http-client";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export function makeIpfsClient() {
  const DRY = String(process.env.DRY_RUN_IPFS || "false").toLowerCase() === "true";
  const MODE = (process.env.IPFS_MODE || "").toLowerCase(); // 'local' | 'kubo' | ''

  // local & dry-run don't need a client
  if (DRY || MODE === "local") return null;

  // fallback: Kubo-compatible /api/v0 (local docker or remote)
  const url = process.env.IPFS_API_URL || "http://127.0.0.1:5001/api/v0";
  const id = process.env.IPFS_PROJECT_ID;
  const secret = process.env.IPFS_PROJECT_SECRET;
  let headers;
  if (id && secret) {
    const auth = Buffer.from(`${id}:${secret}`).toString("base64");
    headers = { authorization: `Basic ${auth}` };
  }
  return create({ url, headers });
}

export async function addJson(client, obj) {
  const DRY = String(process.env.DRY_RUN_IPFS || "false").toLowerCase() === "true";
  const MODE = (process.env.IPFS_MODE || "").toLowerCase();

  console.log(`[IPFS] DRY=${DRY}, MODE="${MODE}", client=${client ? 'exists' : 'null'}`);

  // 0) DRY mode – fake but unique-ish CID
  if (DRY) return `bafymock${Math.random().toString(36).slice(2, 10)}`;

  // 1) Local dev storage (writes to disk, returns stable "dev CID")
  if (MODE === "local") {
    const json = JSON.stringify(obj);
    const hash = crypto.createHash("sha256").update(json).digest("hex");
    const cid = `dev${hash.slice(0, 46)}`; // not a real CID, but stable per content
    const root = process.env.LOCAL_IPFS_DIR || path.join(process.cwd(), "../../.data/ipfs");
    await fs.mkdir(root, { recursive: true });
    await fs.writeFile(path.join(root, `${cid}.json`), json, "utf8");
    return cid;
  }

  // 2) Kubo / ipfs-http-client (free if you run a local node)
  const { cid } = await client.add({
    path: "metadata.json",
    content: Buffer.from(JSON.stringify(obj)),
  });
  return cid.toString();
}
