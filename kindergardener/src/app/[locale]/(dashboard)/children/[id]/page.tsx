import { createClient } from "@/lib/supabase/server"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { ChildProfileContent } from "@/components/child-profile-content"

export default async function ChildProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const t = await getTranslations()
  const supabase = await createClient()

  // Get user profile to check role
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const isStaff = profile?.role === "staff" || profile?.role === "admin"

  // Fetch child (RLS will check access)
  const { data: child, error } = await supabase
    .from("children")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !child) {
    notFound()
  }

  // Fetch contacts
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .eq("child_id", id)
    .order("is_primary", { ascending: false })

  // Fetch last 7 days of attendance
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: attendanceHistory } = await supabase
    .from("attendance")
    .select("*")
    .eq("child_id", id)
    .gte("check_in_time", sevenDaysAgo.toISOString())
    .order("check_in_time", { ascending: false })

  return (
    <ChildProfileContent
      child={child}
      contacts={contacts || []}
      attendanceHistory={attendanceHistory || []}
      isStaff={isStaff}
    />
  )
}
