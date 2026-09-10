#!/usr/bin/env node

/**
 * Hey Jenna — Mock Media Generator
 * Creates lightweight test files and directory structures inside server/uploads/
 * so the AI and developers can test the downloader, clipper, transcriber, and organizer
 * instantly without downloading gigabytes of real video.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const uploadsDir = path.resolve(__dirname, '..', 'server', 'uploads');

const folders = ['raw', 'clips', 'converted', 'audio', 'transcripts'];

console.log('📁 Setting up uploads folder structure...');
for (const folder of folders) {
  const dir = path.join(uploadsDir, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

console.log('📝 Creating sample subtitle / transcription files...');
const sampleSrt = `1
00:00:01,000 --> 00:00:03,500
Welcome to Hey Jenna!

2
00:00:03,600 --> 00:00:06,000
Built by video makers for video makers.
`;

const sampleJson = JSON.stringify({
  text: "Welcome to Hey Jenna! Built by video makers for video makers.",
  segments: [
    { id: 1, start: 1.0, end: 3.5, text: "Welcome to Hey Jenna!" },
    { id: 2, start: 3.6, end: 6.0, text: "Built by video makers for video makers." }
  ]
}, null, 2);

fs.writeFileSync(path.join(uploadsDir, 'transcripts', 'sample.srt'), sampleSrt);
fs.writeFileSync(path.join(uploadsDir, 'transcripts', 'sample.json'), sampleJson);

// Check if ffmpeg is available to generate a real 2-second test video
const ffmpegCheck = spawnSync('ffmpeg', ['-version'], { shell: true });
if (ffmpegCheck.status === 0) {
  console.log('🎥 Generating lightweight 3-second test video via FFmpeg...');
  const testMp4 = path.join(uploadsDir, 'raw', 'sample_test_video.mp4');
  spawnSync('ffmpeg', [
    '-y',
    '-f', 'lavfi', '-i', 'testsrc=duration=3:size=640x360:rate=30',
    '-f', 'lavfi', '-i', 'sine=frequency=1000:duration=3',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    testMp4
  ], { shell: true, stdio: 'ignore' });
  console.log(`✅ Generated: ${testMp4}`);
} else {
  console.log('ℹ️ FFmpeg not detected in PATH; created sample text/subtitle mock files.');
}

console.log('✨ Mock media setup complete!');
