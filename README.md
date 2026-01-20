# story-trials

Monorepo for **Story Trials** — web + API with pnpm workspaces.

## Structure
```txt
.storyignore
.devcontainer/
docker-compose.yml
apps/
  web/    # Next.js
  api/    # Express
prisma/
.env
.env.secrets (gitignored)
package.json  # pnpm workspaces
pnpm-lock.yaml
README.md
```

## Getting Started

```bash
corepack enable
corepack prepare pnpm@latest --activate

pnpm install
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:4000