import { setRequestLocale } from "next-intl/server"
import { redirect } from "next/navigation"

export default async function ChildrenPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  // Redirect to dashboard which shows children
  redirect(`/${locale}`)
}
