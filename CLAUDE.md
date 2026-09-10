# CLAUDE.md — Hey Jenna

> This project follows the open agent standard defined in [AGENTS.md](./AGENTS.md).
> Please consult [AGENTS.md](./AGENTS.md) for full project architecture, coding standards, and workflows.

## Quick Reference Commands

- **Check Media Dependencies (`yt-dlp`, `ffmpeg`)**: `node scripts/check-media-tools.js`
- **Generate Test Media**: `node scripts/mock-media.js`
- **Clean Temp Media**: `node scripts/clean-uploads.js`
- **Full Code Validation**: `bash scripts/validate.sh` (or `scripts\validate.cmd`)
- **Run Dev Server**: `cd server && npm run start:dev`
- **Nest Scaffolding**: `node scripts/nest-generate.js <type> <name>`

## Key Conventions

1. **Media Ingestion & Clipping**: Use `yt-dlp` for full downloads or `--download-sections "*MM:SS-MM:SS"` for time-range clips.
2. **Editor-Ready Output**: Convert with `ffmpeg -c:v libx264 -pix_fmt yuv420p -c:a aac` for Premiere/Final Cut/DaVinci.
3. **Subtitles & Transcription**: Extract 16kHz WAV for Whisper, sync `.srt`/`.vtt` with matching basenames.
4. **Skills**: Available in `.claude/skills/` (`media-pipeline`, `nest`, `review`, `open-pr`, `caveman`).
