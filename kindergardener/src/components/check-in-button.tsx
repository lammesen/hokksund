"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Loader2, LogIn, LogOut } from "lucide-react"
import type { AttendanceStatus } from "@/types/database"

interface CheckInButtonProps {
  status: AttendanceStatus
  onCheckIn: () => void
  onCheckOut: () => void
  isLoading?: boolean
  checkInTime?: string
  checkOutTime?: string
}

export function CheckInButton({
  status,
  onCheckIn,
  onCheckOut,
  isLoading = false,
  checkInTime,
  checkOutTime,
}: CheckInButtonProps) {
  const t = useTranslations("children")

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (status === "picked_up" && checkOutTime) {
    return (
      <div className="text-sm text-muted-foreground text-center py-2">
        {t("checkedOutAt", { time: formatTime(checkOutTime) })}
      </div>
    )
  }

  if (status === "present") {
    return (
      <div className="space-y-2">
        {checkInTime && (
          <div className="text-xs text-muted-foreground text-center">
            {t("checkedInAt", { time: formatTime(checkInTime) })}
          </div>
        )}
        <Button
          onClick={onCheckOut}
          disabled={isLoading}
          className="w-full h-12"
          size="xl"
          variant="secondary"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-5 w-5" />
          )}
          {t("checkOut")}
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={onCheckIn}
      disabled={isLoading}
      className="w-full h-12"
      size="xl"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <LogIn className="mr-2 h-5 w-5" />
      )}
      {t("checkIn")}
    </Button>
  )
}
