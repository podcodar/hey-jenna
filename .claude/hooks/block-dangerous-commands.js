#!/usr/bin/env node
/**
 * PreToolUse hook (matcher: Bash).
 * Blocks:
 *   1. Destructive shell/git/db commands.
 *   2. git add/commit that stages raw media, server/uploads/ contents, or .env files.
 * Exit 2 blocks the tool call and feeds stderr back to Claude as the reason.
 */
const { execSync } = require('child_process');

const DESTRUCTIVE_PATTERNS = [
  { re: /\brm\s+(-\w*\s+)*-\w*[rR]\w*f\w*\b/, msg: 'rm -rf (recursive force delete)' },
  { re: /\brm\s+(-\w*\s+)*-\w*f\w*[rR]\w*\b/, msg: 'rm -fr (recursive force delete)' },
  { re: /\bgit\s+push\b.*(--force\b|(?<!--)\s-f\b)/, msg: 'git push --force / -f' },
  { re: /\bgit\s+reset\s+--hard\b/, msg: 'git reset --hard' },
  { re: /\bgit\s+clean\s+(-\w*\s+)*-\w*f\w*\b/, msg: 'git clean -f' },
  { re: /\bgit\s+branch\s+-D\b/, msg: 'git branch -D (force delete branch)' },
  { re: /--no-verify\b/, msg: '--no-verify (skips git hooks)' },
  { re: /-c\s+commit\.gpgsign=false/, msg: 'bypassing commit signing' },
  { re: /\bDROP\s+TABLE\b/i, msg: 'DROP TABLE' },
  { re: /\bTRUNCATE\b/i, msg: 'TRUNCATE' },
  { re: /\bprisma\s+migrate\s+reset\b/, msg: 'prisma migrate reset (wipes the database)' },
];

const MEDIA_EXT_RE = /\.(mp4|mov|avi|mkv|webm|wav|mp3|flac|m4a|aac|ogg)(["'\s]|$)/i;

function block(reason) {
  process.stderr.write(
    `Blocked by PreToolUse hook (block-dangerous-commands): ${reason}\n` +
      `If this is intentional, ask the user to run it manually instead of via the agent.\n`,
  );
  process.exit(2);
}

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

  const command = payload?.tool_input?.command;
  if (!command || typeof command !== 'string') {
    process.exit(0);
  }

  for (const { re, msg } of DESTRUCTIVE_PATTERNS) {
    if (re.test(command)) {
      block(`destructive command detected (${msg}).`);
    }
  }

  const isGitStage = /\bgit\s+(add|commit)\b/.test(command);
  if (!isGitStage) {
    process.exit(0);
  }

  if (MEDIA_EXT_RE.test(command)) {
    block(
      'command references a raw media file extension (.mp4/.mov/.wav/.mp3/etc). ' +
        'Raw media and downloaded/generated files must never be committed to this repo.',
    );
  }

  if (/\buploads\//.test(command) && !/uploads\/\.gitkeep\b/.test(command)) {
    block(
      'command references server/uploads/ contents. Uploaded/downloaded media must never be committed.',
    );
  }

  if (/(^|[\s"'/])\.env(\.\w+)?\b/.test(command) && !/\.env\.example\b/.test(command)) {
    block('command references a .env file. Files with secrets must never be committed.');
  }

  // Broad staging (git add -A / --all / .) — inspect the working tree for risky paths.
  if (/\bgit\s+add\s+(-A|--all|\.)\s*$/.test(command.trim())) {
    try {
      const cwd = payload.cwd || process.cwd();
      const status = execSync('git status --porcelain', { cwd, encoding: 'utf8' });
      const risky = status
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => l.slice(3).trim())
        .filter((f) => {
          if (MEDIA_EXT_RE.test(f)) return true;
          if (/(^|\/)uploads\//.test(f) && !f.endsWith('.gitkeep')) return true;
          if (/(^|\/)\.env(\.\w+)?$/.test(f) && !f.endsWith('.env.example')) return true;
          return false;
        });

      if (risky.length > 0) {
        block(
          `broad "git add" would stage risky files:\n${risky.join('\n')}\n` +
            'Stage specific files explicitly instead of using -A/--all/. here.',
        );
      }
    } catch {
      // If git status can't run for some reason, don't block on that basis alone.
    }
  }

  process.exit(0);
})();
