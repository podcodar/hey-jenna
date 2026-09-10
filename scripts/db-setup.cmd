@echo off
setlocal enabledelayedexpansion

set "ROOT_DIR=%~dp0.."
set "SERVER_DIR=%ROOT_DIR%\server"

echo === [1/3] Checking Docker Container ===
docker compose -f "%ROOT_DIR%\docker-compose.yaml" up -d

echo === [2/3] Running Prisma Migrations ===
cd /d "%SERVER_DIR%" || exit /b 1
call npx prisma migrate dev || exit /b 1

echo === [3/3] Generating Prisma Client ===
call npx prisma generate || exit /b 1

echo ========================================================
echo  Database is up to date and Prisma Client is generated!
echo ========================================================
exit /b 0
