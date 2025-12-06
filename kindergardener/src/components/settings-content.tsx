"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
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
import { Loader2 } from "lucide-react"
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

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleLanguageChange = async (newLanguage: string) => {
    setIsLanguageLoading(true)
    const supabase = createClient()

    // Get current authenticated user's ID for the update
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      toast.error(t("common.error"))
      setIsLanguageLoading(false)
      return
    }

    const { error } = await supabase
      .from("profiles")
      .update({ language: newLanguage })
      .eq("id", authUser.id)

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

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    setIsPasswordLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success(t("common.success"))
    setIsPasswordDialogOpen(false)
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    const supabase = createClient()

    await supabase.auth.signOut()
    router.push("/login")
  }

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
            <Label className="text-muted-foreground">{t("children.name")}</Label>
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

      {/* Sign Out */}
      <Card>
        <CardHeader>
          <CardTitle>{t("auth.logout")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("auth.logout")}
          </Button>
        </CardContent>
      </Card>

      {/* App Version */}
      <div className="text-center text-sm text-muted-foreground">
        {t("settings.appVersion")}: 1.0.0
      </div>
    </div>
  )
}
