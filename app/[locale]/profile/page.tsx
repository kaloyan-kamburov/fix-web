"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function ProfilePage() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-12 w-full max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{t("profile")}</h1>
    </div>
  );
}
