@echo off
setlocal enabledelayedexpansion

set "ROOT_DIR=%~dp0.."
set "SERVER_DIR=%ROOT_DIR%\server"

echo === [1/4] Checking Git Status ===
git status -s

set "PKG_RUNNER=npm"
where pnpm >nul 2>nul
if %errorlevel% equ 0 (
  set "PKG_RUNNER=pnpm"
)

echo === [2/4] Running Linter ===
cd /d "%SERVER_DIR%" || exit /b 1
call %PKG_RUNNER% run lint || exit /b 1

echo === [3/4] Running Unit Tests ===
call %PKG_RUNNER% run test || exit /b 1

echo === [4/4] Verifying Build ===
call %PKG_RUNNER% run build || exit /b 1

echo =========================================================================
echo  All PR pre-flight checks passed! You are ready to open a Pull Request.
echo =========================================================================
exit /b 0
