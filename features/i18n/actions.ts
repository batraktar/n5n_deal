"use server";

import { cookies } from "next/headers";

import { isLocale } from "@/i18n/config";

export async function setLocaleAction(locale: string): Promise<void> {
  if (!isLocale(locale)) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set("N5DEAL_LOCALE", locale, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    path: "/",
  });
}
