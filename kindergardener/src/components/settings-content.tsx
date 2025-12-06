"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Loader2, AlertTriangle } from "lucide-react"
import type { UserRole } from "@/types/database"

interface SettingsContentProps {
  user: {
    email: string
    fullName: string
    language: string
    role: UserRole
  }
}

export function SettingsContent({ user }: SettingsContentProps) {
  const t = useTranslations()
  const router = useRouter()

  const [language, setLanguage] = useState(user.language)
  const [isLanguageLoading, setIsLanguageLoading] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleLanguageChange = async (newLanguage: string) => {
    setIsLanguageLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("profiles")
      .update({ language: newLanguage })
      .eq("email", user.email)

    setIsLanguageLoading(false)

    if (error) {
      toast.error(t("common.error"))
      return
    }

    setLanguage(newLanguage)
    router.replace("/settings", { locale: newLanguage })
    toast.success(t("common.success"))
  }

  const handlePasswordChange = async () => {
    if (!currentPassword) {
      toast.error(t("settings.currentPasswordIncorrect"))
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error(t("settings.passwordMismatch"))
      return
    }

    if (newPassword.length < 6) {
      toast.error(t("settings.passwordTooShort"))
      return
    }

    setIsPasswordLoading(true)
    const supabase = createClient()

    // Verify current password by attempting to sign in with a temporary client
    // Note: This is a workaround since Supabase doesn't have a dedicated password verification API
    // The sign-in will create a new session, so we need to get the original session back
    const { data: currentSession } = await supabase.auth.getSession()
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })

    // Clear current password from memory immediately
    setCurrentPassword("")

    if (signInError) {
      setIsPasswordLoading(false)
      toast.error(t("settings.currentPasswordIncorrect"))
      return
    }

    // Restore original session if it exists
    if (currentSession?.session) {
      await supabase.auth.setSession(currentSession.session)
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    // Clear passwords from memory immediately
    const passwordUpdateError = error
    setNewPassword("")
    setConfirmPassword("")
    
    setIsPasswordLoading(false)

    if (passwordUpdateError) {
      toast.error(passwordUpdateError.message)
      return
    }

    toast.success(t("common.success"))
    setIsPasswordDialogOpen(false)
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    const supabase = createClient()

    // Sign out and redirect - actual deletion would be handled by admin
    await supabase.auth.signOut()
    router.push("/login")
  }

  const canDelete = user.role === "parent"

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.profile")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">{t("auth.email")}</Label>
            <p className="font-medium">{user.email}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">{t("settings.name")}</Label>
            <div className="flex items-center gap-2">
              <p className="font-medium">{user.fullName || "-"}</p>
              <Badge variant="secondary">{user.role}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.language")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select
              value={language}
              onValueChange={handleLanguageChange}
              disabled={isLanguageLoading}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">{t("languages.no")}</SelectItem>
                <SelectItem value="en">{t("languages.en")}</SelectItem>
              </SelectContent>
            </Select>
            {isLanguageLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
        </CardContent>
      </Card>

      {/* Change Password Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.changePassword")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">{t("settings.changePassword")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("settings.changePassword")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">{t("settings.currentPassword")}</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t("settings.newPassword")}</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">
                    {t("settings.confirmPassword")}
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsPasswordDialogOpen(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button onClick={handlePasswordChange} disabled={isPasswordLoading}>
                  {isPasswordLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("common.save")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {canDelete && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">{t("settings.dangerZone")}</CardTitle>
            <CardDescription>{t("settings.deleteWarning")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">{t("settings.deleteAccount")}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    {t("settings.deleteAccount")}
                  </DialogTitle>
                  <DialogDescription>{t("settings.deleteWarning")}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("common.delete")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* App Version */}
      <div className="text-center text-sm text-muted-foreground">
        {t("settings.appVersion")}: 1.0.0
      </div>
    </div>
  )
}
