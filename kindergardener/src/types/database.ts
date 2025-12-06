export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = "parent" | "staff" | "admin"

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: UserRole
          language: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: UserRole
          language?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: UserRole
          language?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      children: {
        Row: {
          id: string
          first_name: string
          last_name: string
          date_of_birth: string | null
          group_name: string | null
          photo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          date_of_birth?: string | null
          group_name?: string | null
          photo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          date_of_birth?: string | null
          group_name?: string | null
          photo_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      parent_child: {
        Row: {
          parent_id: string
          child_id: string
        }
        Insert: {
          parent_id: string
          child_id: string
        }
        Update: {
          parent_id?: string
          child_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_child_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_child_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          }
        ]
      }
      attendance: {
        Row: {
          id: string
          child_id: string
          check_in_time: string
          check_in_by: string | null
          check_out_time: string | null
          check_out_by: string | null
        }
        Insert: {
          id?: string
          child_id: string
          check_in_time?: string
          check_in_by?: string | null
          check_out_time?: string | null
          check_out_by?: string | null
        }
        Update: {
          id?: string
          child_id?: string
          check_in_time?: string
          check_in_by?: string | null
          check_out_time?: string | null
          check_out_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_check_in_by_fkey"
            columns: ["check_in_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_check_out_by_fkey"
            columns: ["check_out_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      contacts: {
        Row: {
          id: string
          child_id: string
          contact_name: string
          relationship: string | null
          phone: string | null
          email: string | null
          is_primary: boolean
        }
        Insert: {
          id?: string
          child_id: string
          contact_name: string
          relationship?: string | null
          phone?: string | null
          email?: string | null
          is_primary?: boolean
        }
        Update: {
          id?: string
          child_id?: string
          contact_name?: string
          relationship?: string | null
          phone?: string | null
          email?: string | null
          is_primary?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "contacts_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_staff_or_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      has_child_access: {
        Args: {
          child_uuid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"]
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"]

export type Child = Database["public"]["Tables"]["children"]["Row"]
export type ChildInsert = Database["public"]["Tables"]["children"]["Insert"]
export type ChildUpdate = Database["public"]["Tables"]["children"]["Update"]

export type ParentChild = Database["public"]["Tables"]["parent_child"]["Row"]
export type ParentChildInsert = Database["public"]["Tables"]["parent_child"]["Insert"]
export type ParentChildUpdate = Database["public"]["Tables"]["parent_child"]["Update"]

export type Attendance = Database["public"]["Tables"]["attendance"]["Row"]
export type AttendanceInsert = Database["public"]["Tables"]["attendance"]["Insert"]
export type AttendanceUpdate = Database["public"]["Tables"]["attendance"]["Update"]

export type Contact = Database["public"]["Tables"]["contacts"]["Row"]
export type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"]
export type ContactUpdate = Database["public"]["Tables"]["contacts"]["Update"]

// Child with attendance status for dashboard
export type ChildWithAttendance = Child & {
  todayAttendance: Attendance | null
}

// Attendance status enum
export type AttendanceStatus = "present" | "not_arrived" | "picked_up"

export function getAttendanceStatus(attendance: Attendance | null): AttendanceStatus {
  if (!attendance) return "not_arrived"
  if (attendance.check_out_time) return "picked_up"
  return "present"
}
