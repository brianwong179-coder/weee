import 'server-only'

/**
 * The admin tool is a local authoring surface only. It must never be reachable
 * on the deployed public site, so every admin page and API route gates on this.
 * Set ENABLE_ADMIN=1 if you ever want it available in a non-dev build.
 */
export function adminEnabled(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.ENABLE_ADMIN === '1'
}
