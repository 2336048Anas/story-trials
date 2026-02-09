# Story Trials

A consent-based health data marketplace demo built on [Story Protocol](https://www.story.foundation/).
Contributors submit synthetic health data to clinical trials, buyers purchase licenses, and royalties are tracked on-chain.
**All data is synthetic -- no real patient data or financial transactions.**

## Features

- **Asset Registration** -- Upload synthetic health data, pin to IPFS, and register as an IP Asset on Story Protocol
- **Clinical Trials Marketplace** -- Buyers post trials, contributors submit data
- **License Management** -- Purchase licenses for data assets with on-chain license minting
- **Royalty Tracking** -- Royalty events and payout records for data contributors
- **Dashboard Analytics** -- Overview of assets, trials, licenses, and earnings
- **Wallet Integration** -- Connect via RainbowKit with MetaMask, WalletConnect, and more
- **Mock Mode** -- Full-featured development without a blockchain wallet or testnet funds

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Blockchain | Story Protocol SDK v1.4.0-rc.2, Aeneid testnet (chain ID 1315) |
| Wallet | RainbowKit, wagmi, viem |
| Backend | Express.js, Prisma 6, Zod validation |
| Frontend | Next.js 14, React 18, TanStack React Query, react-hook-form |
| UI | shadcn/ui, Radix primitives, Tailwind CSS, sonner (toasts) |
| Storage | PostgreSQL (Prisma ORM), local IPFS emulation (`.data/ipfs/`) |

## Prerequisites

- **Node.js** 18+
- **pnpm** (enable with `corepack enable && corepack prepare pnpm@latest --activate`)
- **PostgreSQL** running locally or remotely

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd story-trials
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   ```bash
   # API
   cp apps/api/.env.example apps/api/.env
   # Edit apps/api/.env and set DATABASE_URL to your PostgreSQL connection string

   # Web
   # Create apps/web/.env.local with the following:
   #   NEXT_PUBLIC_API_URL=http://localhost:4000
   #   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<your-walletconnect-project-id>
   ```

4. **Set up the database**

   ```bash
   pnpm --filter @story/api db:generate
   pnpm --filter @story/api db:push
   ```

5. **Start the development servers**

   ```bash
   pnpm dev
   ```

   - Web: http://localhost:3000
   - API: http://localhost:4000

## Environment Variables

### API (`apps/api/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | -- |
| `SHADOW_DATABASE_URL` | Shadow DB for Prisma migrations | -- |
| `IPFS_MODE` | `local` (disk) or `remote` (IPFS node) | `local` |
| `LOCAL_IPFS_DIR` | Path for local IPFS file storage | `../../.data/ipfs` |
| `STORY_PRIVATE_KEY` | Hex private key for Story Protocol operator wallet | -- |
| `STORY_RPC_URL` | RPC endpoint for Story Protocol | `https://aeneid.storyrpc.io` |
| `SPG_NFT_CONTRACT` | SPG NFT contract address | -- |
| `DRY_RUN_STORY` | `true` = mock mode, `false` = real chain calls | `true` |
| `ALLOW_REAL_PAYMENTS` | Safety guard -- keep `false` for demo | `false` |
| `PORT` | API server port | `4000` |

### Web (`apps/web/.env.local`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:4000` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | -- |

## Story Protocol Integration

The API supports two modes controlled by the `DRY_RUN_STORY` environment variable:

- **Mock mode** (`DRY_RUN_STORY=true`) -- Returns simulated chain responses. No wallet or contract deployment needed. This is the default and recommended for local development.
- **Real mode** (`DRY_RUN_STORY=false`) -- Connects to the Story Protocol Aeneid testnet. Requires a funded wallet (`STORY_PRIVATE_KEY`) and a deployed SPG NFT contract (`SPG_NFT_CONTRACT`).

To deploy the SPG NFT contract for real mode:

```bash
node apps/api/scripts/setup-spg.mjs
```

## Project Structure

```
story-trials/
  apps/
    api/
      src/
        index.js              # Express entry point
        routes/               # REST route handlers
        services/             # Business logic (Story Protocol, IPFS)
      scripts/                # Setup scripts (SPG deployment)
    web/
      app/                    # Next.js App Router pages
      components/             # UI components (shadcn/ui + feature components)
      providers/              # React context providers (Web3, QueryClient)
      hooks/                  # Custom React hooks
      lib/                    # Utilities
      types/                  # TypeScript type definitions
  prisma/
    schema.prisma             # Shared Prisma schema (PostgreSQL)
  .data/ipfs/                 # Local IPFS file storage (gitignored)
```

## API Routes

| Prefix | Description |
|--------|-------------|
| `GET /health` | Health check |
| `/assets` | Data asset CRUD, IP registration on Story Protocol |
| `/trials` | Clinical trial listings |
| `/licenses` | License purchasing with on-chain tracking |
| `/payments` | Payment records |
| `/users` | User management (contributors, buyers, admins) |

## License

MIT
