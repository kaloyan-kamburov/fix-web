"use client";

import * as React from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Globe } from "lucide-react";

type ApiCountry = {
  id?: unknown;
  name?: unknown;
  code?: unknown; // ISO-2 uppercase
  flag?: unknown;
};

type Country = {
  id: number;
  name: string;
  code: string; // ISO-2 uppercase
  flag: string;
};

const toStringSafe = (v: unknown): string =>
  typeof v === "string" ? v : String(v ?? "");
const toNumberSafe = (v: unknown): number => {
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export default function CountrySelector() {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);
  const [countries, setCountries] = React.useState<Country[]>([]);
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams();

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    let active = true;
    const run = async () => {
      try {
        const res = await fetch(
          "https://kmp-admin.perspectiveunity.com/api/countries",
          { cache: "force-cache" }
        );
        const raw = await res.json();
        const arr: ApiCountry[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : [];
        const normalized: Country[] = arr.map((it) => ({
          id: toNumberSafe(it?.id),
          name: toStringSafe(it?.name),
          code: toStringSafe(it?.code).toUpperCase(),
          flag: toStringSafe(it?.flag),
        }));
        if (active) setCountries(normalized);
      } catch {}
    };
    run();
    return () => {
      active = false;
    };
  }, [open]);

  const onSelect = (country: Country) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("preferred_country", country.code);
      }
    } catch {}
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) parts.push(country.code.toLowerCase());
    else parts[0] = country.code.toLowerCase();
    const nextPath = "/" + parts.join("/");
    router.push(nextPath);
    setOpen(false);
  };

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest?.("#country-only-selector-modal")) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-2 py-1 rounded border border-neutral-400 cursor-pointer bg-transparent h-11"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Globe />
        {locale && `${locale}`.toUpperCase()}
      </button>
      {open &&
        mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4">
            <div
              id="country-only-selector-modal"
              className="w-full max-w-[720px] bg-white rounded-xl p-6 shadow-lg"
              role="dialog"
            >
              <header className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-zinc-900">
                  {t("chooseCountry")}
                </h2>
                <button
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded cursor-pointer ml-auto"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                      fill="#1C1C1D"
                    />
                  </svg>
                </button>
              </header>
              <div className="mt-4 max-h-[420px] overflow-y-auto">
                {countries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => onSelect(c)}
                    className="flex items-center gap-3 w-full text-left py-2 px-2 hover:bg-neutral-100 rounded"
                  >
                    {c.flag ? (
                      <Image src={c.flag} alt={c.name} width={24} height={18} />
                    ) : (
                      <span className="w-6 h-4 bg-neutral-300 inline-block" />
                    )}
                    <span className="text-zinc-900 text-base font-medium">
                      {c.name}
                    </span>
                    <span className="ml-auto text-neutral-500 text-sm">
                      {c.code}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
