#!/usr/bin/env node
/**
 * PostToolUse hook (matcher: Edit|Write).
 * Runs Prettier on the edited file if it lives under server/ and has a
 * supported extension, using the project's own local Prettier + config.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const FORMATTABLE_RE = /\.(ts|js|json|md)$/;

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data));
  });
}

(async () => {
  const raw = await readStdin();
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const filePath = payload?.tool_input?.file_path;
  if (!filePath) process.exit(0);

  const repoRoot = payload.cwd || process.cwd();
  const serverDir = path.join(repoRoot, 'server');
  const absFile = path.isAbsolute(filePath) ? filePath : path.join(repoRoot, filePath);

  const relToServer = path.relative(serverDir, absFile);
  const isInsideServer = relToServer && !relToServer.startsWith('..') && !path.isAbsolute(relToServer);

  if (!isInsideServer) process.exit(0);
  if (!FORMATTABLE_RE.test(absFile)) process.exit(0);
  if (!fs.existsSync(absFile)) process.exit(0);

  try {
    execFileSync('pnpm', ['exec', 'prettier', '--write', relToServer], {
      cwd: serverDir,
      stdio: 'pipe',
    });
  } catch (err) {
    // Never block on formatting failures — just report and move on.
    process.stderr.write(`format-after-edit: prettier failed for ${relToServer}: ${err.message}\n`);
  }

  process.exit(0);
})();
