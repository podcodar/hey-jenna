# Hey Jenna — AI Agent Guidelines & Project Harness

## Project Overview

**Hey Jenna** is a web application built by video makers for video makers.
It is a media ingestion, processing, and organization engine that:
1. **Downloads Videos & Sections**: Uses `yt-dlp` to download full videos or specific time-range clips (`--download-sections "*01:30-03:45"`).
2. **Transcribes & Syncs Subtitles**: Extracts 16kHz audio for Whisper transcription and generates synchronized `.srt` / `.vtt` / `.json` timestamp files.
3. **Converts to Editor-Ready `.mp4`**: Uses `ffmpeg` with H.264 (`libx264`), AAC audio, and `yuv420p` pixel format for compatibility with Premiere Pro, DaVinci Resolve, and Final Cut Pro.
4. **Organizes Media Assets**: Sorts assets into structured folders (`/raw`, `/clips`, `/converted`, `/audio`, `/transcripts`).

- **Backend**: NestJS 10.x + TypeScript (Node 22.x)
- **Database**: PostgreSQL 16 + Prisma 6.x
- **Media Binaries**: `yt-dlp`, `ffmpeg`, `ffprobe`
- **Documentation**: Swagger / OpenAPI (`@nestjs/swagger`)
- **Testing**: Jest

---

## Directory Structure

```text
hey-jenna/
├── .agent/skills/          # Gemini / Antigravity Agent Skills
├── .claude/                # Claude Code / Open Harness configuration
│   ├── hooks/              # Lifecycle hooks (SessionStart, PreToolUse)
│   ├── settings.json       # Hook definitions
│   └── skills/             # Skills (media-pipeline, nest, review, open-pr, caveman)
├── scripts/                # Deterministic automation tools
│   ├── check-media-tools.js# Verifies yt-dlp, ffmpeg, ffprobe versions
│   ├── mock-media.js       # Generates sample video/subtitles for testing
│   ├── clean-uploads.js    # Cleans temporary clips and temp media
│   ├── nest-generate.js    # NestJS schematics scaffolding tool
│   ├── validate.sh / .cmd  # Single-command lint, test, and build validator
│   ├── db-setup.sh / .cmd  # Docker DB check & Prisma migrations
│   └── pr-check.sh / .cmd  # Pre-PR verification tool
├── server/                 # NestJS Application
│   ├── prisma/             # Prisma schema & migrations
│   ├── src/                # Application modules
│   │   ├── core/           # Shared logging and utilities
│   │   ├── users/          # Users feature module
│   │   ├── videos/         # Videos & media pipeline module
│   │   ├── app.module.ts
│   │   └── system.service.ts # File storage & filesystem operations
│   └── uploads/            # Local media storage (ignored by git)
│       ├── raw/            # Original downloads
│       ├── clips/          # Partial video clips
│       ├── converted/      # Editor-ready .mp4 files
│       ├── audio/          # Extracted audio
│       └── transcripts/    # Subtitles & transcripts (.srt, .json)
├── docker-compose.yaml     # Postgres container
├── AGENTS.md               # Standard agent guidelines (AAIF)
├── CLAUDE.md               # Claude Code entrypoint
└── GEMINI.md               # Gemini / Antigravity entrypoint
```

---

## Media Pipeline Conventions

### 1. Partial & Time-Range Video Clipping
- Use `yt-dlp --download-sections "*MM:SS-MM:SS" --force-keyframes-at-cuts` for partial downloads without downloading entire large files.
- Alternatively, for already downloaded files, use fast stream trimming: `ffmpeg -ss HH:MM:SS -to HH:MM:SS -i input.mp4 -c copy output.mp4`.

### 2. Video Conversion Standard
- Always ensure video exports targeting video editors use:
  `ffmpeg -i input -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart output.mp4`

### 3. Subtitles & Audio Sync
- Extract 16kHz mono audio for Whisper: `ffmpeg -i input.mp4 -vn -acodec pcm_s16le -ar 16000 -ac 1 output.wav`
- Save `.srt` alongside output `.mp4` using matching basenames.

---

## Development & Automation Commands

| Task | Command |
| :--- | :--- |
| **Check Media Tools** | `node scripts/check-media-tools.js` |
| **Generate Mock Media** | `node scripts/mock-media.js` |
| **Clean Temp Media** | `node scripts/clean-uploads.js` |
| **Scaffold Nest Component** | `node scripts/nest-generate.js <type> <name>` |
| **Run Migrations** | `bash scripts/db-setup.sh` (or `scripts\db-setup.cmd`) |
| **Full Validation** | `bash scripts/validate.sh` (or `scripts\validate.cmd`) |
| **PR Verification** | `bash scripts/pr-check.sh` (or `scripts\pr-check.cmd`) |

---

## Available Skills

1. **`media-pipeline`**: yt-dlp downloading, section clipping, FFmpeg encoding recipes, Whisper transcription, and subtitle sync.
2. **`nest`**: NestJS CLI scaffolding for modules, services, controllers, DTOs, and Prisma integration.
3. **`review`**: Comprehensive code review for NestJS, Prisma, DTO validation, and security.
4. **`open-pr`**: Pre-flight verification and Conventional Commits PR creator.
5. **`caveman`**: Token-saving concise output mode.
