export const locales = ["no", "en"] as const
export const defaultLocale = "no" as const

export type Locale = (typeof locales)[number]
