/**
 * Validates a redirect URL to prevent open redirect vulnerabilities.
 * Only allows relative paths that start with "/" but not "//".
 * Returns the safe redirect URL or a default fallback.
 */
export function getSafeRedirectUrl(url: string | null, fallback: string = "/"): string {
  if (!url) return fallback

  // Must start with exactly one forward slash (not protocol-relative //)
  // and not contain protocol indicators
  const isRelativePath = /^\/(?!\/)/.test(url)
  const hasProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)

  if (isRelativePath && !hasProtocol) {
    return url
  }

  return fallback
}
