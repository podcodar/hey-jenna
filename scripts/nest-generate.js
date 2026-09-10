#!/usr/bin/env node

/**
 * Deterministic NestJS generator runner.
 * Usage: node scripts/nest-generate.js <schematic> <name> [options]
 * Examples:
 *   node scripts/nest-generate.js resource posts
 *   node scripts/nest-generate.js module analytics
 *   node scripts/nest-generate.js service analytics
 *   node scripts/nest-generate.js controller analytics
 */

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const serverDir = path.resolve(__dirname, '..', 'server');

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
Hey Jenna — NestJS Generator Tool
Usage: node scripts/nest-generate.js <schematic> <name> [options]

Schematics:
  resource      Generate a complete CRUD resource (REST API)
  module        Generate a NestJS module
  service       Generate a NestJS service
  controller    Generate a NestJS controller
  guard         Generate a NestJS guard
  pipe          Generate a NestJS pipe
  filter        Generate a NestJS filter
  interceptor   Generate a NestJS interceptor

Examples:
  node scripts/nest-generate.js resource comments
  node scripts/nest-generate.js module auth
  node scripts/nest-generate.js service auth
`);
  process.exit(0);
}

const schematic = args[0];
const name = args[1];
const extraArgs = args.slice(2);

if (!name) {
  console.error(`Error: Missing component name. Example: node scripts/nest-generate.js ${schematic} <name>`);
  process.exit(1);
}

console.log(`🚀 Generating NestJS ${schematic} '${name}' in server/src/...`);

const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const nestArgs = ['nest', 'g', schematic, name, ...extraArgs];

const result = spawnSync(npxCmd, nestArgs, {
  cwd: serverDir,
  stdio: 'inherit',
  shell: true,
});

if (result.status !== 0) {
  console.error(`❌ NestJS CLI generation failed with exit code ${result.status}`);
  process.exit(result.status || 1);
}

console.log(`✅ Scaffolding complete for ${schematic} '${name}'!`);
console.log(`📌 Remember to:`);
console.log(`   1. Add validation decorators in DTO files (class-validator)`);
console.log(`   2. Add Swagger API documentation (@ApiProperty, @ApiTags)`);
console.log(`   3. Wire database queries with PrismaService`);
console.log(`   4. Run 'bash scripts/validate.sh' or 'pnpm run test' to verify`);
