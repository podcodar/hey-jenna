#!/usr/bin/env bash
# Claude Code PostToolUse Hook
# Runs after tool execution to ensure upload folder integrity

UPLOADS_DIR="$(dirname "$0")/../../server/uploads"

if [ -d "$UPLOADS_DIR" ]; then
  mkdir -p "$UPLOADS_DIR/raw" "$UPLOADS_DIR/clips" "$UPLOADS_DIR/converted" "$UPLOADS_DIR/audio" "$UPLOADS_DIR/transcripts"
fi

exit 0
