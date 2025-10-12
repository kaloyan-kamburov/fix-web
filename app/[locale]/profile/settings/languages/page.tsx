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
      <div className="flex flex-col items-center w-full max-w-[1440px]">
        <div className="mx-auto w-full">
          <Link
            href={`/${locale}/profile/settings`}
            className="flex relative gap-2 items-center self-stretch cursor-pointer max-sm:gap-1.5 w-fit mt-4"
            aria-label={t("back")}
          >
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 7.5H3.83L9.42 1.91L8 0.5L0 8.5L8 16.5L9.41 15.09L3.83 9.5H16V7.5Z"
                fill="#1C1C1D"
              />
            </svg>
            <div className="relative text-lg font-bold text-center text-zinc-900 max-md:text-base max-sm:text-sm">
              <div className="text-lg font-bold text-zinc-900 max-md:text-base max-sm:text-sm">
                {t("back")}
              </div>
            </div>
          </Link>
        </div>
        <div className="w-full flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-center text-gray-100">
            {t("language")}
          </h1>

          <ul className="w-full flex flex-col gap-3 max-w-[720px] mx-auto">
            {items.map((it) => (
              <li key={it.locale} className="w-full">
                <Link
                  href={`/${it.locale}-${locale}/profile/settings/languages/`}
                  className="w-full flex items-center gap-3 p-4 rounded-lg bg-gray-10 hover:opacity-90 cursor-pointer"
                >
                  {it.flag ? (
                    <Image src={it.flag} alt={it.name} width={24} height={16} />
                  ) : (
                    <span className="w-6 h-4 bg-neutral-300 inline-block" />
                  )}
                  <span className="text-gray-100 text-base font-semibold">
                    {it.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : null;
}
