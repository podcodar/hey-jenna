# AGENTS.md — Hey Jenna

Guide for AI agents (Claude Code and others) working in this repository. Read this before editing code.

## What the project is

Hey Jenna is an API for downloading and managing YouTube videos ("An App made by Video Makers for Video Makers"). Today the repository only contains the backend, in `server/`.

## Stack

- **Runtime**: Node 22 (`.nvmrc`), managed with pnpm (do not use `npm`/`yarn`).
- **Framework**: NestJS 10 (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`).
- **ORM**: Prisma 6, Postgres. Client generated in `server/generated/prisma` (custom path in `schema.prisma`, **not** the default `node_modules/.prisma/client`).
- **Validation**: `class-validator` + `class-transformer` via `ValidationPipe`.
- **API docs**: `@nestjs/swagger`, mounted at `/api` (see `server/src/main.ts`).
- **Tests**: Jest (`*.spec.ts` for unit, `server/test/*.e2e-spec.ts` for e2e).
- **Lint/format**: ESLint (`@typescript-eslint` + `eslint-plugin-prettier`) and Prettier.
- **Local infra**: Postgres via `docker-compose.yaml` at the repo root (user/password `admin`, database `jenna`, port 5432).

## Folder structure

```
hey-jenna/
├── docker-compose.yaml        # local Postgres
└── server/                    # NestJS API (only app today)
    ├── prisma/
    │   └── schema.prisma      # models + migrations
    ├── generated/prisma/      # generated Prisma Client (gitignored)
    ├── uploads/                # downloaded video/media files (NEVER version the content)
    ├── src/
    │   ├── main.ts             # bootstrap + Swagger
    │   ├── app.module.ts       # root module, imports feature modules
    │   ├── prisma.service.ts   # PrismaService (lives at the root of src, not in its own module)
    │   ├── system.service.ts   # reads/writes uploads/, path sanitization
    │   ├── core/logging/       # AppLogger (ConsoleLogger, Scope.TRANSIENT)
    │   └── <feature>/          # one module per feature (users/, videos/, ...)
    │       ├── <feature>.module.ts
    │       ├── <feature>.controller.ts
    │       ├── <feature>.service.ts
    │       └── <feature>.dto.ts   # all DTOs for the feature in a single file
    └── test/                   # e2e tests
```

Every new feature should follow this same folder pattern (`module` + `controller` + `service` + `dto` inside `src/<feature>/`). Do not create a per-file `dto/` subfolder — the project keeps all DTOs for a feature in a single `<feature>.dto.ts`.

## Observed code conventions

- **Imports**: inside `src/`, the project mixes relative imports (`./users.service`) with absolute imports via `baseUrl` (`src/system.service`). When editing an existing file, follow the style already used in that file; in a new file, prefer relative imports within the same feature and `src/...` when crossing features.
- **DTOs**: classes exported from `<feature>.dto.ts`, decorated with `class-validator` (`@IsString`, `@IsUUID`, `@IsNotEmpty`, etc). Class naming is inconsistent in the current codebase (`CreateUserDto` vs `GetFilesQueryDTO`) — for new code, prefer the `Dto` suffix (PascalCase, lowercase for the rest), matching the Nest CLI convention.
- **Controllers**: use `@UsePipes(new ValidationPipe())` at the controller level (not global in `main.ts`). Methods return an explicitly typed `Promise<T>`.
- **Providers/DI**: every `*.module.ts` explicitly declares all providers it uses, including shared ones like `AppLogger` and `SystemService` (there is no `@Global()` module for them yet). When creating a new feature that needs them, add them to the module's `providers` array.
- **Logger**: use `AppLogger` (`src/core/logging/app-logger.service.ts`), injected via the constructor. **Never use `console.log`/`console.error`** directly — the ESLint rule `no-console: 'error'` forbids it.
- **Formatting**: Prettier with `singleQuote: true` and `trailingComma: 'all'` (see `server/.prettierrc`). Run `pnpm run format` or let the `PostToolUse` hook (see `.claude/settings.json`) apply it automatically.
- **Filesystem security**: any code that builds a path from user input must sanitize it the way `system.service.ts` does (`sanitizeFilename`, `sanitizePath`) to prevent path traversal. Do not reinvent ad-hoc sanitization instead of following this pattern.
- **Prisma**: schema changes always go through `npx prisma migrate dev --name <name>` inside `server/`, followed by `npx prisma generate`. Never manually edit files under `server/generated/prisma` — they are generated.
- **Tests**: test file next to the code (`*.spec.ts`) for unit tests, `server/test/*.e2e-spec.ts` for e2e. TypeScript here runs with `strictNullChecks: false` and `noImplicitAny: false` — you don't need to force strict typing where the rest of the code doesn't, but also don't make what already exists worse.

## What the AI must never do

- **Never commit `server/uploads/`** (videos, audio, or any downloaded/generated media) nor any raw media file anywhere in the repo (`.mp4`, `.mov`, `.avi`, `.mkv`, `.webm`, `.wav`, `.mp3`, `.flac`, `.m4a`, `.aac`, `.ogg`). `server/uploads/*` is in `.gitignore` (except `.gitkeep`), but `server/uploads/test.txt` is still **tracked** from before this rule existed — do not add anything new there, and flag to the user that this legacy file should be removed from the index (`git rm --cached`) when convenient.
- **Never commit `.env`, `.env.*`**, or any file with credentials/secrets (e.g. a real `DATABASE_URL`).
- **Never manually edit** `server/generated/prisma/**` — regenerate it with `npx prisma generate`.
- **Never run destructive migrations or commands** (`prisma migrate reset`, `prisma migrate deploy` against production, manual `DROP`/`TRUNCATE`) without explicit user confirmation.
- **Never commit `server/dist/`, `server/node_modules/`, or `server/coverage/`** — these are already build artifacts.
- **Never use `git push --force`, `git reset --hard`, `git clean -f`, or `--no-verify`** without an explicit user request.
- **Never introduce `console.log`** in production code — use `AppLogger`.
- **Never version the local Postgres data** (the `docker-compose.yaml` container's volume) nor hardcode database credentials outside of `.env`.

## Useful commands

Always run these inside `server/` (or use the scripts in `scripts/` at the repo root, which already do that):

```bash
pnpm install
pnpm run lint      # eslint --fix
pnpm run format    # prettier --write
pnpm run build     # nest build
pnpm run test      # jest
pnpm run test:e2e  # jest e2e
```

Database:

```bash
docker compose up -d            # start local Postgres (from the repo root)
npx prisma migrate dev          # apply migrations
npx prisma generate             # regenerate the client in server/generated/prisma
npx prisma studio               # UI to inspect the database
```
