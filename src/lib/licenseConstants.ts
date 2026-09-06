/** Shared license validation constants.
 *  Importable from both client components and admin pages.
 */

/** Offline grace period: if the last successful server check-in is older
 *  than this value, re-validation against the server is required.
 *  10 days in milliseconds.
 */
export const GRACE_PERIOD_MS = 10 * 24 * 60 * 60 * 1000;
