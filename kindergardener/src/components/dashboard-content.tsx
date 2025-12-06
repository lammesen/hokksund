"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { useChildren } from "@/hooks/use-children"
import { ChildCard } from "@/components/child-card"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Users, UserCheck, UserX } from "lucide-react"
import { getAttendanceStatus } from "@/types/database"
import type { AttendanceStatus } from "@/types/database"

interface DashboardContentProps {
  isStaff: boolean
}

type FilterStatus = "all" | AttendanceStatus

export function DashboardContent({ isStaff }: DashboardContentProps) {
  const t = useTranslations()
  const { children, isLoading, refetch } = useChildren()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [groupFilter, setGroupFilter] = useState<string>("all")

  // Get unique groups
  const groups = useMemo(() => {
    const uniqueGroups = new Set(
      children.map((c) => c.group_name).filter(Boolean)
    )
    return Array.from(uniqueGroups) as string[]
  }, [children])

  // Filter children
  const filteredChildren = useMemo(() => {
    return children.filter((child) => {
      // Search filter
      const fullName = `${child.first_name} ${child.last_name}`.toLowerCase()
      if (searchQuery && !fullName.includes(searchQuery.toLowerCase())) {
        return false
      }

      // Status filter
      if (statusFilter !== "all") {
        const status = getAttendanceStatus(child.todayAttendance)
        if (status !== statusFilter) {
          return false
        }
      }

      // Group filter
      if (groupFilter !== "all" && child.group_name !== groupFilter) {
        return false
      }

      return true
    })
  }, [children, searchQuery, statusFilter, groupFilter])

  // Calculate stats
  const stats = useMemo(() => {
    const total = children.length
    const present = children.filter(
      (c) => getAttendanceStatus(c.todayAttendance) === "present"
    ).length
    const pickedUp = children.filter(
      (c) => getAttendanceStatus(c.todayAttendance) === "picked_up"
    ).length
    const notArrived = total - present - pickedUp

    return { total, present, pickedUp, notArrived }
  }, [children])

  if (isLoading) {
    return <DashboardSkeleton isStaff={isStaff} />
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards - Staff only */}
      {isStaff && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label={t("dashboard.totalChildren")}
            value={stats.total}
            icon={Users}
          />
          <StatCard
            label={t("dashboard.present")}
            value={stats.present}
            icon={UserCheck}
            variant="success"
          />
          <StatCard
            label={t("dashboard.notArrived")}
            value={stats.notArrived}
            icon={UserX}
            variant="muted"
          />
          <StatCard
            label={t("dashboard.pickedUp")}
            value={stats.pickedUp}
            icon={UserCheck}
            variant="info"
          />
        </div>
      )}

      {/* Filters - Staff only */}
      {isStaff && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("dashboard.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as FilterStatus)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("dashboard.filterAll")}</SelectItem>
                <SelectItem value="present">{t("dashboard.checkedIn")}</SelectItem>
                <SelectItem value="not_arrived">
                  {t("dashboard.notArrived")}
                </SelectItem>
                <SelectItem value="picked_up">{t("dashboard.pickedUp")}</SelectItem>
              </SelectContent>
            </Select>

            {groups.length > 0 && (
              <Select value={groupFilter} onValueChange={setGroupFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={t("dashboard.filterGroup")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("dashboard.filterAll")}</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      )}

      {/* Summary text */}
      <p className="text-sm text-muted-foreground">
        {t("dashboard.todaySummary", {
          checked: stats.present,
          total: stats.total,
        })}
      </p>

      {/* Children Grid */}
      {filteredChildren.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {t("dashboard.noChildren")}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChildren.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              attendance={child.todayAttendance}
              onAttendanceUpdate={refetch}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: number
  icon: React.ElementType
  variant?: "default" | "success" | "muted" | "info"
}

function StatCard({ label, value, icon: Icon, variant = "default" }: StatCardProps) {
  const variantClasses = {
    default: "text-foreground",
    success: "text-green-500",
    muted: "text-muted-foreground",
    info: "text-blue-500",
  }

  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`p-2 rounded-full bg-muted ${variantClasses[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton({ isStaff }: { isStaff: boolean }) {
  return (
    <div className="space-y-6">
      {isStaff && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isStaff && (
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[140px]" />
        </div>
      )}

      <Skeleton className="h-4 w-48" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
