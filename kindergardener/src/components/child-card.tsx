"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/status-badge"
import { CheckInButton } from "@/components/check-in-button"
import { Link } from "@/i18n/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { Child, Attendance, AttendanceStatus } from "@/types/database"
import { getAttendanceStatus } from "@/types/database"

interface ChildCardProps {
  child: Child
  attendance: Attendance | null
  onAttendanceUpdate?: () => void
}

export function ChildCard({
  child,
  attendance,
  onAttendanceUpdate,
}: ChildCardProps) {
  const t = useTranslations()
  const isOnline = useOnlineStatus()
  const [isLoading, setIsLoading] = useState(false)
  const [currentAttendance, setCurrentAttendance] = useState<Attendance | null>(
    attendance
  )

  const status: AttendanceStatus = getAttendanceStatus(currentAttendance)

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  const handleCheckIn = async () => {
    if (!isOnline) {
      toast.error(t("children.offlineWarning"))
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    // Get current user for audit trail
    const { data: { user } } = await supabase.auth.getUser()

    // Check for existing attendance record today to prevent duplicates
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { data: existingAttendance } = await supabase
      .from("attendance")
      .select("id")
      .eq("child_id", child.id)
      .gte("check_in_time", today.toISOString())
      .lt("check_in_time", tomorrow.toISOString())
      .maybeSingle()

    if (existingAttendance) {
      toast.error(t("children.alreadyCheckedIn"))
      setIsLoading(false)
      return
    }

    const { data, error } = await supabase
      .from("attendance")
      .insert({
        child_id: child.id,
        check_in_time: new Date().toISOString(),
        check_in_by: user?.id,
      })
      .select()
      .single()

    setIsLoading(false)

    if (error) {
      toast.error(t("children.checkInFailed"))
      return
    }

    setCurrentAttendance(data)
    onAttendanceUpdate?.()
  }

  const handleCheckOut = async () => {
    if (!currentAttendance) return

    if (!isOnline) {
      toast.error(t("children.offlineWarning"))
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    // Get current user for audit trail
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from("attendance")
      .update({
        check_out_time: new Date().toISOString(),
        check_out_by: user?.id,
      })
      .eq("id", currentAttendance.id)
      .select()
      .single()

    setIsLoading(false)

    if (error) {
      toast.error(t("children.checkOutFailed"))
      return
    }

    setCurrentAttendance(data)
    onAttendanceUpdate?.()
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <Link href={`/children/${child.id}`} className="block">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16">
              {child.photo_url && (
                <AvatarImage src={child.photo_url} alt={child.first_name} />
              )}
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {getInitials(child.first_name, child.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">
                {child.first_name} {child.last_name}
              </h3>
              {child.group_name && (
                <p className="text-sm text-muted-foreground">{child.group_name}</p>
              )}
            </div>
            <StatusBadge status={status} />
          </div>
        </Link>

        <CheckInButton
          status={status}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          isLoading={isLoading}
          checkInTime={currentAttendance?.check_in_time}
          checkOutTime={currentAttendance?.check_out_time ?? undefined}
        />
      </CardContent>
    </Card>
  )
}
