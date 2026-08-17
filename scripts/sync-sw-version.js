#!/usr/bin/env node
/**
 * scripts/sync-sw-version.js
 *
 * Reads the `version` field from package.json and rewrites the CACHE_NAME
 * constant in public/sw.js to "mi-scout-v{version}".
 *
 * Runs automatically via the `prebuild` npm hook before every build.
 * Also safe to run manually: node scripts/sync-sw-version.js
 */

const fs   = require('fs');
const path = require('path');

const root       = path.resolve(__dirname, '..');
const pkgPath    = path.join(root, 'package.json');
const swPath     = path.join(root, 'public', 'sw.js');

const { version } = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const cacheName   = `mi-scout-v${version}`;

let sw = fs.readFileSync(swPath, 'utf8');

// Replace whatever is inside the single-quotes of CACHE_NAME = '...'
sw = sw.replace(
  /^(const CACHE_NAME\s*=\s*')[^']*(';\s*)$/m,
  `$1${cacheName}$2`
);

fs.writeFileSync(swPath, sw, 'utf8');
console.log(`[sync-sw-version] CACHE_NAME set to '${cacheName}'`);
