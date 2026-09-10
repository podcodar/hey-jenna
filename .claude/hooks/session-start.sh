#!/usr/bin/env bash
# Claude Code / Open Harness SessionStart Hook
echo "⚡ Hey Jenna AI Harness Initialized"
echo "🎬 Media Engine: yt-dlp + FFmpeg + Whisper Transcription"
echo "📦 Tech Stack: NestJS + Prisma + PostgreSQL (Docker)"
echo "💡 Available skills: /media-pipeline, /nest, /review, /open-pr, /caveman"
echo ""

# Quick media check
if command -v ffmpeg >/dev/null 2>&1 && command -v yt-dlp >/dev/null 2>&1; then
  echo "✅ Binary Tools: FFmpeg & yt-dlp detected and ready."
else
  echo "⚠️ Warning: FFmpeg or yt-dlp not detected. Run 'node scripts/check-media-tools.js' for details."
fi
