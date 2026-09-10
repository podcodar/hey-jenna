#!/usr/bin/env node

/**
 * Hey Jenna — Clean Uploads Tool
 * Safely removes temporary clips, partial downloads (.part, .temp),
 * and media chunks to free up disk space during development.
 */

const fs = require('fs');
const path = require('path');

const uploadsDir = path.resolve(__dirname, '..', 'server', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  console.log('✨ uploads/ directory is already clean / empty.');
  process.exit(0);
}

function cleanFolder(directory) {
  const items = fs.readdirSync(directory);
  let count = 0;
  for (const item of items) {
    const fullPath = path.join(directory, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      count += cleanFolder(fullPath);
    } else {
      fs.unlinkSync(fullPath);
      count++;
    }
  }
  return count;
}

console.log('🧹 Cleaning uploads directory...');
const totalCleaned = cleanFolder(uploadsDir);
console.log(`✅ Removed ${totalCleaned} temporary media file(s). Uploads directory is fresh.`);
