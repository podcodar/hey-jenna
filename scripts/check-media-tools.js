#!/usr/bin/env node

/**
 * Hey Jenna — Media Tools Diagnostic
 * Checks if yt-dlp, ffmpeg, and ffprobe are available in the system PATH.
 */

const { spawnSync } = require('child_process');

const tools = [
  { name: 'yt-dlp', cmd: 'yt-dlp', args: ['--version'], url: 'https://github.com/yt-dlp/yt-dlp' },
  { name: 'ffmpeg', cmd: 'ffmpeg', args: ['-version'], url: 'https://ffmpeg.org/download.html' },
  { name: 'ffprobe', cmd: 'ffprobe', args: ['-version'], url: 'https://ffmpeg.org/download.html' },
];

console.log('🎬 Hey Jenna — Media Engine Dependency Check\n');

let allInstalled = true;

for (const tool of tools) {
  try {
    const result = spawnSync(tool.cmd, tool.args, { encoding: 'utf-8', shell: true });
    if (result.status === 0) {
      const versionLine = result.stdout.trim().split('\n')[0];
      console.log(`✅ ${tool.name.padEnd(10)} [INSTALLED] (${versionLine.substring(0, 45)})`);
    } else {
      console.log(`❌ ${tool.name.padEnd(10)} [NOT FOUND / ERROR]`);
      console.log(`   👉 Install guide: ${tool.url}`);
      allInstalled = false;
    }
  } catch (err) {
    console.log(`❌ ${tool.name.padEnd(10)} [NOT FOUND]`);
    console.log(`   👉 Install guide: ${tool.url}`);
    allInstalled = false;
  }
}

console.log('\n------------------------------------------------------------');
if (allInstalled) {
  console.log('🎉 All media dependencies are ready to process video/audio!');
} else {
  console.log('⚠️ Some tools are missing. Video downloading/converting will require them.');
}
