@echo off
setlocal enabledelayedexpansion

echo === [1/4] Entering server directory ===
cd /d "%~dp0..\server" || exit /b 1

set "PKG_RUNNER=npm"
where pnpm >nul 2>nul
if %errorlevel% equ 0 (
  set "PKG_RUNNER=pnpm"
)

echo === [2/4] Running Linter ===
call %PKG_RUNNER% run lint || exit /b 1

echo === [3/4] Running Unit Tests ===
call %PKG_RUNNER% run test || exit /b 1

echo === [4/4] Building Project ===
call %PKG_RUNNER% run build || exit /b 1

echo ===========================================
echo  All validation checks passed successfully!
echo ===========================================
exit /b 0
