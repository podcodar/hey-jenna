#!/usr/bin/env bash
set -e

echo "=== [1/4] Entering server directory ==="
cd "$(dirname "$0")/../server"

if command -v pnpm >/dev/null 2>&1; then
  PKG_RUNNER="pnpm"
else
  PKG_RUNNER="npm"
fi

echo "=== [2/4] Running Linter ==="
$PKG_RUNNER run lint

echo "=== [3/4] Running Unit Tests ==="
$PKG_RUNNER run test

echo "=== [4/4] Building Project ==="
$PKG_RUNNER run build

echo "✅ All validation checks passed successfully!"
