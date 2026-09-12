---
name: open-pr
description: Pre-PR check (lint, tests, build) and PR description generation in Conventional Commits style for this repository. Use when the user asks to open/prepare a PR, or asks whether the code is ready for a PR.
allowed-tools: Bash(scripts/check.sh) Bash(git *) Bash(gh *)
---

# Open PR — Hey Jenna

## 1. Run the deterministic gate

Always run the single script before proposing to open the PR — don't run `lint`/`test`/`build` manually and separately when this script exists:

```bash
scripts/check.sh
```

This runs, inside `server/`, in this order: `pnpm run lint` → `pnpm run test` → `pnpm run build`. If any step fails, stop and fix it before continuing — don't generate the PR description with a broken gate unless the user explicitly asks to proceed anyway.

If the diff touches `server/prisma/schema.prisma`, confirm a new migration exists under `server/prisma/migrations/` (run `npx prisma migrate dev --name <name>` inside `server/` if it hasn't been done yet) and that `npx prisma generate` was run.

## 2. Check the diff before describing it

```bash
git status
git diff <base-branch>...HEAD
git log <base-branch>..HEAD --oneline
```

Use this to know exactly what's in the PR — don't assume based on the user's request.

Also confirm nothing under `server/uploads/`, `.env`, or raw media (`.mp4/.wav/.mov/...`) is staged (`git status --porcelain`). If it is, warn the user and don't proceed with the PR until it's unstaged.

## 3. Generate the title and description

**Title**: Conventional Commits, short (ideally under 70 characters):

```
<type>(<optional scope>): <imperative summary>
```

Accepted types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `ci`. Scopes that make sense in this project: `videos`, `users`, `prisma`, `logging`, `system`, `server`.

Real examples from this repo's history: `feat: add Video model and migration`, `fix: apply review fixes`.

**Description body** (use the template below):

```markdown
## Summary
- <1-3 bullets, focused on "why", not just "what">

## Changes
- <objective bullets of what changed, by relevant module/file>

## Test plan
- [ ] `scripts/check.sh` passed (lint + test + build)
- [ ] <relevant manual steps, e.g. test endpoint X via Swagger at /api>
- [ ] Migration applied locally with `npx prisma migrate dev` (if there's a schema change)
```

## 4. Open the PR

Only run `gh pr create` after confirming with the user — never open a PR without explicit confirmation, even if the gate passed. Use `gh pr create --title "..." --body "$(cat <<'EOF' ... EOF)"` with the content generated above, ending the description with the session's standard attribution when applicable.
