#!/usr/bin/env bash
set -e

ROOT_DIR="$(dirname "$0")/.."
SERVER_DIR="$ROOT_DIR/server"

echo "=== [1/3] Checking Docker Container ==="
if command -v docker >/dev/null 2>&1; then
  echo "Ensuring Postgres container is running..."
  docker compose -f "$ROOT_DIR/docker-compose.yaml" up -d
else
  echo "⚠️ Docker command not found. Assuming PostgreSQL is running locally or externally."
fi

echo "=== [2/3] Running Prisma Migrations ==="
cd "$SERVER_DIR"
npx prisma migrate dev

echo "=== [3/3] Generating Prisma Client ==="
npx prisma generate

echo "✅ Database is up to date and Prisma Client generated!"
