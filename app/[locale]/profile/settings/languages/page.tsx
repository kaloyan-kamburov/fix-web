"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeftIcon } from "lucide-react";
import { api } from "@/lib/api";

// Reuse the LanguageSelector's fetch logic indirectly by calling the same endpoint
type LanguageItem = { locale: string; name: string; flag: string };

export default function LanguagesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [items, setItems] = React.useState<LanguageItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        setLoading(true);
        const res = await api.get("countries");
        const raw = res.data;
        if (!active) return;
        const arr: any[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : [];
        const out: LanguageItem[] = [];
        for (const country of arr) {
          const languages: any[] = Array.isArray(country?.tenant?.languages)
            ? country.tenant.languages
            : [];
          for (const l of languages) {
            const code = String(l?.code || "").toLowerCase();
            const name = String(l?.name || code).trim();
            const flag = String(l?.flag || "");
            if (code && !out.find((x) => x.locale === code)) {
              out.push({ locale: code, name, flag });
            }
          }
        }
        setItems(out);
      } catch (_) {}
      // no loading state
      setLoading(false);
    };
    run();
    return () => {
      active = false;
    };
  }, []);

  return !loading ? (
    <div className="flex flex-col items-center w-full px-4 sm:px-8 bg-gray-10">
      <div className="flex flex-col items-center w-full max-w-[720px]">
        <div className="w-full">
          <Link
            href={`/${locale}/profile/settings`}
            className="flex items-center gap-2 py-4"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-100 cursor-pointer" />
            {t("back")}
          </Link>
        </div>
        <div className="w-full flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-center text-gray-100">
            {t("language")}
          </h1>

          <ul className="w-full flex flex-col gap-3">
            {items.map((it) => (
              <li key={it.locale} className="w-full">
                <button className="w-full flex items-center gap-3 p-4 rounded-lg bg-gray-00 hover:opacity-90 cursor-pointer">
                  {it.flag ? (
                    <Image src={it.flag} alt={it.name} width={24} height={16} />
                  ) : (
                    <span className="w-6 h-4 bg-neutral-300 inline-block" />
                  )}
                  <span className="text-gray-100 text-base font-semibold">
                    {it.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : null;
}
