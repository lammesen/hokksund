"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { AttendanceStatus } from "@/types/database"

interface StatusBadgeProps {
  status: AttendanceStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const t = useTranslations("dashboard")

  const statusConfig = {
    present: {
      label: t("checkedIn"),
      variant: "success" as const,
    },
    not_arrived: {
      label: t("notArrived"),
      variant: "secondary" as const,
    },
    picked_up: {
      label: t("pickedUp"),
      variant: "info" as const,
    },
  }

  const config = statusConfig[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}
