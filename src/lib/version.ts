/**
 * Single source of truth for the MiScout app version.
 * All UI components, reports, and the service worker cache should derive
 * their version string from this constant (or from the sync-sw-version script).
 *
 * To update the app version: change `version` in package.json and run
 * `npm run prebuild` (or `npm run build`) — the SW cache name is synced automatically.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version } = require('../../package.json') as { version: string };

/** Full semver string, e.g. "1.3.6" */
export const APP_VERSION: string = version;

/** Short display label, e.g. "v1.3.6" */
export const APP_VERSION_LABEL: string = `v${version}`;
