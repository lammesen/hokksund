import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

const nextConfig: NextConfig = {
  // Enable React strict mode for development best practices
  reactStrictMode: true,
  // Note: next-pwa v5.6.0 doesn't support Next.js 15+.
  // PWA functionality uses manifest.json + icons for "Add to Home Screen".
  // For full offline support, consider migrating to @ducanh2912/next-pwa or serwist.
}

export default withNextIntl(nextConfig)
