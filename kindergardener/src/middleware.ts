import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"
import createIntlMiddleware from "next-intl/middleware"
import { routing } from "@/i18n/routing"

const intlMiddleware = createIntlMiddleware(routing)

// Public paths that don't require authentication
const publicPaths = ["/login", "/auth/callback"]

// Static asset paths to skip middleware
const staticPaths = [
  "/_next",
  "/icons",
  "/manifest.json",
  "/favicon.ico",
  "/sw.js",
  "/workbox-",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static assets
  if (staticPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Update Supabase session
  const { user, supabaseResponse } = await updateSession(request)

  // Get locale from pathname
  const pathnameHasLocale = /^\/(no|en)(\/|$)/.test(pathname)
  const locale = pathnameHasLocale ? pathname.split("/")[1] : "no"
  const pathWithoutLocale = pathnameHasLocale
    ? pathname.replace(/^\/(no|en)/, "") || "/"
    : pathname

  // Check if path is public (login page)
  const isPublicPath = publicPaths.some(
    (path) => pathWithoutLocale === path || pathWithoutLocale.startsWith(path)
  )

  // If user is not authenticated and trying to access protected route
  if (!user && !isPublicPath) {
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user is authenticated and trying to access login page
  if (user && pathWithoutLocale === "/login") {
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  // Apply intl middleware for locale handling
  const intlResponse = intlMiddleware(request)

  // Merge cookies from supabase response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, {
      ...cookie,
    })
  })

  return intlResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
