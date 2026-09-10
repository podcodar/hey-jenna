#!/usr/bin/env bash
# Claude Code PreToolUse Guardrail Hook
# Receives tool input as JSON on stdin.
# Exits with 2 to block dangerous operations.

INPUT=$(cat)

# 1. Block destructive git or system commands
if echo "$INPUT" | grep -qE "git push.*--force.*main|git reset --hard HEAD~[0-9]+|rm -rf /"; then
  echo "❌ Blocked dangerous operation by PreToolUse guardrail." >&2
  exit 2
fi

# 2. Block accidental staging/committing of raw media files into Git
if echo "$INPUT" | grep -qE "git add .*\.(mp4|mkv|mov|avi|wav|mp3)|git add .*uploads/"; then
  echo "❌ Guardrail alert: Raw media files in uploads/ must not be committed to Git." >&2
  exit 2
fi

# 3. Block accidental deletion of database migrations
if echo "$INPUT" | grep -qE "rm .*(prisma/migrations|prisma\\\\migrations)"; then
  echo "❌ Guardrail alert: Never delete existing Prisma migrations directly." >&2
  exit 2
fi

exit 0
