#!/usr/bin/env bash
set -euo pipefail
echo "Setting up workspace with pnpm..."
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
echo "Done."