---
name: review
description: Multi-point code review for changes in server/ (NestJS, Prisma, security). Use when the user asks to review a diff, PR, branch, or specific file in this repository before merging.
---

# Review — Hey Jenna server

Project-specific review checklist. This is not a generic "best practices" review — check against the real conventions described in `AGENTS.md` (read that file first if it's not already in context).

## Scope

By default, review the current diff (`git diff` against the base branch, or `git diff HEAD` if there's no open PR). If the user points at a specific PR/branch/file, review only that.

## 1. Project conventions (NestJS)

- Does a new feature follow the `src/<feature>/{<feature>.module,<feature>.controller,<feature>.service,<feature>.dto}.ts` structure? There shouldn't be a separate `dto/` subfolder.
- Does the module explicitly declare in `providers` everything the controller/service actually injects (including `AppLogger`, `SystemService`, `PrismaService` when used)? A missing provider only breaks at runtime, not at type-check time.
- Do controllers use `@UsePipes(new ValidationPipe())` when receiving `@Body`/`@Query`/`@Param` typed by a DTO?
- No `console.log`/`console.error`/`console.warn` was introduced — the ESLint rule `no-console: 'error'` forbids it; the correct logger is `AppLogger` injected via the constructor.
- Controller methods declare an explicit return type (`Promise<X>`), as elsewhere in the project.
- No leftover dead code or "doubt" comments like `// Do I need X here?` (there's an existing example like this in `app.module.ts` — don't repeat that pattern).

## 2. Prisma

- Do schema changes (`server/prisma/schema.prisma`) come with a matching migration generated via `npx prisma migrate dev --name <name>` (check for a new folder under `server/prisma/migrations/`)? A schema change without a corresponding migration is a bug.
- No file under `server/generated/prisma/**` was manually edited — this client is generated, any edits there will be lost on the next `prisma generate`.
- Queries running inside a loop (`for`/`.map` with `await this.prisma...`) — flag a possible N+1; suggest `findMany` with `where: { id: { in: [...] } }` or `include`/`select` where applicable.
- Do operations that need to be atomic (e.g. creating a record + writing a file to `uploads/`) use `prisma.$transaction` when multiple database writes need to stay consistent with each other?
- Sensitive or large fields (e.g. `filePath`, `fileSize` on `Video`) aren't being exposed unnecessarily in API responses.

## 3. Security

- Does any code that builds a path from user input (filename, subfolder, id) use sanitization equivalent to `SystemService.sanitizeFilename`/`sanitizePath` (`server/src/system.service.ts`)? Path traversal (`../`) is the concrete risk already mitigated there — don't reintroduce an unsanitized path in parallel.
- Do input DTOs have validation (`class-validator`) for every field later used in the service — without validation, data reaches Prisma/the filesystem without type/format checking.
- No secret (`DATABASE_URL`, tokens, keys) was hardcoded in the code — it should come from `process.env` via `.env` (not versioned).
- No change adds or versions files under `server/uploads/` or raw media (`.mp4`, `.wav`, `.mov`, etc) — see the rules in `AGENTS.md`.
- Endpoints that read/write files don't let the user's `id`/`fileType` escape the `uploads/` directory (check use of `resolve`/`join` and prefix comparison).

## 4. Tests

- Does a behavior change in a service/controller have a `*.spec.ts` covering the new path (success + at least one error/validation case)?
- If the change affects an endpoint, does the corresponding e2e test in `server/test/` exist or get updated?

## Output

List findings grouped by the sections above, each with a file:line reference and one objective sentence describing the problem. Don't repeat conventions that are already being followed correctly — report only what needs to change.
