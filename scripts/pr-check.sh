#!/usr/bin/env bash
set -e

ROOT_DIR="$(dirname "$0")/.."
SERVER_DIR="$ROOT_DIR/server"

echo "=== [1/4] Checking Git Status ==="
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️ Working tree has uncommitted changes:"
  git status -s
fi

if command -v pnpm >/dev/null 2>&1; then
  PKG_RUNNER="pnpm"
else
  PKG_RUNNER="npm"
fi

echo "=== [2/4] Running Linter ==="
cd "$SERVER_DIR"
$PKG_RUNNER run lint

echo "=== [3/4] Running Unit Tests ==="
$PKG_RUNNER run test

echo "=== [4/4] Verifying Build ==="
$PKG_RUNNER run build

echo "🎉 All PR pre-flight checks passed! You are ready to open a Pull Request."
