"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Phone, Mail, Calendar, Users } from "lucide-react"
import type { Child, Contact, Attendance } from "@/types/database"

interface ChildProfileContentProps {
  child: Child
  contacts: Contact[]
  attendanceHistory: Attendance[]
  isStaff: boolean
}

export function ChildProfileContent({
  child,
  contacts,
  attendanceHistory,
  isStaff,
}: ChildProfileContentProps) {
  const t = useTranslations()

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("common.back")}
      </Link>

      {/* Child Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
          {child.photo_url && (
            <AvatarImage src={child.photo_url} alt={child.first_name} />
          )}
          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
            {getInitials(child.first_name, child.last_name)}
          </AvatarFallback>
        </Avatar>

        <div className="text-center sm:text-left flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {child.first_name} {child.last_name}
          </h1>

          <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3 text-muted-foreground">
            {child.group_name && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{child.group_name}</span>
              </div>
            )}
            {child.date_of_birth && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(child.date_of_birth)}</span>
              </div>
            )}
          </div>

          {isStaff && (
            <Button variant="outline" className="mt-4">
              {t("common.edit")}
            </Button>
          )}
        </div>
      </div>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("children.emergencyContacts")}</CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p className="text-muted-foreground">No contacts found</p>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{contact.contact_name}</span>
                      {contact.is_primary && (
                        <Badge variant="secondary" className="text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                    {contact.relationship && (
                      <p className="text-sm text-muted-foreground">
                        {contact.relationship}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {contact.phone && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${contact.phone}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          {t("children.call")}
                        </a>
                      </Button>
                    )}
                    {contact.email && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${contact.email}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          {t("children.sendEmail")}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("children.attendanceHistory")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("children.lastSevenDays")}</p>
        </CardHeader>
        <CardContent>
          {attendanceHistory.length === 0 ? (
            <p className="text-muted-foreground">No attendance records</p>
          ) : (
            <div className="space-y-2">
              {attendanceHistory.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between py-3 border-b last:border-b-0"
                >
                  <div className="font-medium">
                    {formatDateShort(record.check_in_time)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="text-green-600">
                      {t("children.checkIn")}: {formatTime(record.check_in_time)}
                    </span>
                    {record.check_out_time && (
                      <>
                        <span className="mx-2">-</span>
                        <span className="text-blue-600">
                          {t("children.checkOut")}: {formatTime(record.check_out_time)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
