import { createClient } from "@/lib/supabase/server"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { DashboardContent } from "@/components/dashboard-content"

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations()
  const supabase = await createClient()

  // Get user profile
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
    : { data: null }

  const isStaff = profile?.role === "staff" || profile?.role === "admin"

  // Get greeting based on time of day
  const hour = new Date().getHours()
  let greeting: string
  if (hour < 12) {
    greeting = t("dashboard.goodMorning")
  } else if (hour < 17) {
    greeting = t("dashboard.goodAfternoon")
  } else {
    greeting = t("dashboard.goodEvening")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {greeting}, {profile?.full_name?.split(" ")[0] || ""}
        </h1>
      </div>

      <DashboardContent isStaff={isStaff} />
    </div>
  )
}
