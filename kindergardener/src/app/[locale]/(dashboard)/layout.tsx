import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { BottomNav } from "@/components/bottom-nav"
import { setRequestLocale } from "next-intl/server"

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader
        user={{
          email: user.email || "",
          fullName: profile?.full_name || user.email?.split("@")[0] || "User",
          role: profile?.role || "parent",
        }}
      />

      <main className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6 max-w-7xl">
        {children}
      </main>

      <BottomNav />
    </div>
  )
}
