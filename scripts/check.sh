#!/usr/bin/env bash
# Deterministic pre-PR gate for the Hey Jenna server: lint + unit tests + build.
# Usage: scripts/check.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVER_DIR="$ROOT_DIR/server"

cd "$SERVER_DIR"

echo "==> [1/3] lint (eslint --fix)"
pnpm run lint

echo "==> [2/3] unit tests (jest)"
pnpm run test

echo "==> [3/3] build (nest build)"
pnpm run build

echo "==> All checks passed."
