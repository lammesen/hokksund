"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Child, Attendance } from "@/types/database"

export interface ChildWithAttendance extends Child {
  todayAttendance: Attendance | null
}

export function useChildren() {
  const [children, setChildren] = useState<ChildWithAttendance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChildren = useCallback(async () => {
    // Clear previous error state and set loading
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()

      // Get today's date range
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      // Fetch children (RLS will filter based on user role)
      const { data: childrenData, error: childrenError } = await supabase
        .from("children")
        .select("*")
        .order("first_name")

      if (childrenError) {
        throw new Error(childrenError.message)
      }

      // Fetch today's attendance for all children
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .gte("check_in_time", today.toISOString())
        .lt("check_in_time", tomorrow.toISOString())

      if (attendanceError) {
        throw new Error(attendanceError.message)
      }

      // Combine children with their attendance
      const childrenWithAttendance: ChildWithAttendance[] = (childrenData ?? []).map(
        (child) => ({
          ...child,
          todayAttendance:
            (attendanceData ?? []).find((a) => a.child_id === child.id) || null,
        })
      )

      setChildren(childrenWithAttendance)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch children"
      setError(message)
      setChildren([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchChildren()
  }, [fetchChildren])

  return {
    children,
    isLoading,
    error,
    refetch: fetchChildren,
  }
}
