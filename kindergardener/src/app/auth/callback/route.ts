import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { getSafeRedirectUrl } from "@/lib/security"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = getSafeRedirectUrl(searchParams.get("next"), "/no")

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/no/login?error=auth`)
}
