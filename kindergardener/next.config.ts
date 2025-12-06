import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

const nextConfig: NextConfig = {
  // Enable React strict mode for development best practices
  reactStrictMode: true,
  // PWA: Basic "Add to Home Screen" works via manifest.json + icons.
  // For full offline/service worker support, add @ducanh2912/next-pwa or serwist.
}

export default withNextIntl(nextConfig)
