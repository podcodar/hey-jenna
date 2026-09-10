---
name: media-pipeline
description: Best practices, CLI flags, and NestJS service architecture for Hey Jenna's media pipeline (yt-dlp downloading, time-range section clipping, FFmpeg MP4 editing conversions, Whisper transcriptions, and file organization).
---

# Media Pipeline Skill — Hey Jenna

Use this skill whenever working on video/audio downloading, time-range clipping, FFmpeg video conversion, Whisper transcription, or media file organization.

---

## 1. Downloading & Section Clipping (`yt-dlp`)

### Full Video Download
```bash
yt-dlp \
  -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" \
  --merge-output-format mp4 \
  --output "uploads/raw/%(title)s.%(ext)s" \
  "<URL>"
```

### Time-Range Section Clipping (Partial Download)
To download only specific sections without fetching the entire multi-gigabyte video:
```bash
yt-dlp \
  --download-sections "*00:01:30-00:03:45" \
  --force-keyframes-at-cuts \
  -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" \
  --merge-output-format mp4 \
  --output "uploads/clips/%(title)s_clip_%(section_start)s-%(section_end)s.%(ext)s" \
  "<URL>"
```

### Key `yt-dlp` Options in NestJS
- `--no-playlist`: Prevent accidental whole-channel/playlist downloads unless requested.
- `--restrict-filenames`: Avoid special characters in local paths.
- `--no-warnings` & `--progress`: Capture stdout/stderr cleanly in NestJS logger.

---

## 2. Editor-Friendly FFmpeg Conversion (`.mp4`)

Video editing software (Adobe Premiere Pro, DaVinci Resolve, Final Cut Pro) requires standard H.264 (AVC) video with AAC audio and `yuv420p` pixel format:

```bash
ffmpeg -i "input_video.ext" \
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  "output_ready_for_editor.mp4"
```

### Fast Lossless Trimming (when already MP4):
```bash
ffmpeg -ss 00:01:00 -to 00:02:30 -i input.mp4 -c copy output_clip.mp4
```

---

## 3. Transcription & Subtitle Sync (Whisper / Subtitles)

1. **Extract Audio for Whisper**:
   ```bash
   ffmpeg -i "input.mp4" -vn -acodec pcm_s16le -ar 16000 -ac 1 "audio_for_whisper.wav"
   ```
2. **Generate `.srt` / `.vtt`**:
   Ensure transcription timestamps sync accurately with video clips.
3. Save subtitles alongside the video using matching basenames:
   - `video_name.mp4`
   - `video_name.srt`
   - `video_name.json` (word-level timestamps)

---

## 4. File Organization & Storage Structure

Standard structure in `uploads/`:
```text
uploads/
├── raw/           # Original untouched downloads
├── clips/         # Clipped sections (start-end timestamps)
├── converted/     # Premiere / DaVinci Resolve ready .mp4
├── audio/         # 16kHz mono WAV for Whisper
└── transcripts/   # .srt, .vtt, .txt, .json timestamp files
```

---

## 5. DTO Conventions for Media Endpoints

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl, Matches } from 'class-validator';

export class DownloadVideoDto {
  @ApiProperty({ description: 'YouTube / Video URL', example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ description: 'Start time (HH:MM:SS or MM:SS)', example: '01:30' })
  @IsOptional()
  @Matches(/^(\d{1,2}:)?[0-5]?\d:[0-5]\d$/, { message: 'Start time must be MM:SS or HH:MM:SS' })
  startTime?: string;

  @ApiPropertyOptional({ description: 'End time (HH:MM:SS or MM:SS)', example: '03:45' })
  @IsOptional()
  @Matches(/^(\d{1,2}:)?[0-5]?\d:[0-5]\d$/, { message: 'End time must be MM:SS or HH:MM:SS' })
  endTime?: string;

  @ApiPropertyOptional({ description: 'Auto-convert to editor-ready MP4', default: true })
  @IsOptional()
  convertToEditorMp4?: boolean;

  @ApiPropertyOptional({ description: 'Auto-transcribe video', default: true })
  @IsOptional()
  transcribe?: boolean;
}
```
