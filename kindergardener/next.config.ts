import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

const nextConfig: NextConfig = {
  // Disable strict mode for production (PWA compatibility)
  reactStrictMode: true,
}

export default withNextIntl(nextConfig)
