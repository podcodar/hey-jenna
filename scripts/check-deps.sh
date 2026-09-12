#!/usr/bin/env bash
# Deterministic dependency-health check for server/: lockfile sync + outdated packages.
# Usage: scripts/check-deps.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVER_DIR="$ROOT_DIR/server"

cd "$SERVER_DIR"

echo "==> Checking pnpm-lock.yaml is in sync with package.json"
pnpm install --frozen-lockfile --dry-run

echo
echo "==> Outdated dependencies (informational, does not fail the build)"
pnpm outdated || true
