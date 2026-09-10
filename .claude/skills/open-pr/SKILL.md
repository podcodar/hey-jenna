---
name: open-pr
description: Automates pre-PR verification, Conventional Commits title drafting, PR body generation, and GitHub PR creation for the Hey Jenna repository.
---

# Open Pull Request Skill — Hey Jenna

Use this skill when preparing to open a Pull Request against `main` or another target branch.

## Workflow

### 1. Pre-Flight Verification
Always verify the codebase status before opening a PR:
```bash
bash scripts/pr-check.sh
```
This ensures:
- All git changes are tracked and committed.
- Linter passes with no errors (`pnpm run lint`).
- All unit tests pass (`pnpm run test`).
- TypeScript build succeeds (`pnpm run build`).

### 2. Determine PR Title
Follow **Conventional Commits**:
- `feat(scope): short description` (e.g. `feat(videos): add video transcoding status endpoint`)
- `fix(scope): short description` (e.g. `fix(auth): handle expired refresh token error`)
- `refactor(scope): short description`
- `test(scope): short description`
- `docs(scope): short description`
- `chore(scope): short description`

### 3. Generate PR Body

Use the standard project PR template:

```markdown
## 📝 Description
Brief overview of what this pull request introduces and why it is needed.

## 🔗 Related Issue
Closes #[issue_number]

## 🛠️ Changes Made
- Summary bullet 1
- Summary bullet 2
- Summary bullet 3

## 🧪 How Has This Been Tested?
- [x] Unit tests passed (`pnpm run test`)
- [x] Linter passed (`pnpm run lint`)
- [x] Build passed (`pnpm run build`)
- [ ] Manual verification in local/staging environment

## 📌 Checklist
- [x] My code follows the project's code style and guidelines.
- [x] I have updated documentation / Swagger annotations where appropriate.
- [x] I have added unit tests for new functionality.
- [x] All database migrations (if any) are committed.
```

### 4. Create the Pull Request

If GitHub CLI (`gh`) is available, create the PR directly:
```bash
gh pr create --title "<type>(<scope>): <title>" --body "<body_content>"
```
If `gh` is not installed or unauthenticated, output the formatted title, body, and git push instructions for the developer.
