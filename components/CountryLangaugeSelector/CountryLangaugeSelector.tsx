"use client";
import React from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { api } from "@/lib/api";
import Loader from "../Loader/Loader";
import { CountrySelector, type CountryItem } from "./CountrySelector";
import { LanguageSelector, type LanguageItem } from "./LanguageSelector";

// Module-level cache so data persists across modal unmounts
const COUNTRIES_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
let countriesCache: CountryItem[] | null = null;
let codeToLangCache: Record<string, LanguageItem[]> | null = null;
let countriesCachedAt: number | null = null;

type ApiLanguage = { name?: unknown; code?: unknown; flag?: unknown };
type ApiCountry = {
  id?: unknown;
  name?: unknown;
  code?: unknown; // uppercase ISO-2
  flag?: unknown;
  tenant?: { languages?: ApiLanguage[] } | unknown;
};

export type CountryLanguageSelectorProps = {
  open: boolean;
  onClose: () => void;
};

const toStringSafe = (v: unknown): string =>
  typeof v === "string" ? v : String(v ?? "");
const toNumberSafe = (v: unknown): number => {
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const CountryLanguageSelector: React.FC<
  CountryLanguageSelectorProps
> = ({ open, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [countries, setCountries] = React.useState<CountryItem[]>([]);
  const [selectedCountry, setSelectedCountry] =
    React.useState<CountryItem | null>(null);
  const [languages, setLanguages] = React.useState<LanguageItem[]>([]);
  const [codeToLanguages, setCodeToLanguages] = React.useState<
    Record<string, LanguageItem[]>
  >({});

  // Use module-level cache instead of component refs

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    let active = true;
    // Reset any previous selection so languages are hidden until user clicks a country
    setSelectedCountry(null);
    setLanguages([]);
    const applyData = (
      items: CountryItem[],
      map: Record<string, LanguageItem[]>
    ) => {
      if (!active) return;
      setCountries(items);
      setCodeToLanguages(map);
      // Do not auto-select any country; keep languages hidden until user chooses
    };

    const run = async () => {
      try {
        const now = Date.now();
        // 1) Serve from module cache if fresh
        if (
          countriesCache &&
          typeof countriesCachedAt === "number" &&
          now - countriesCachedAt < COUNTRIES_CACHE_TTL_MS &&
          codeToLangCache
        ) {
          applyData(countriesCache, codeToLangCache);
          setLoading(false);
          return;
        }

        setLoading(true);
        // 2) Fetch via axios api
        const res = await api.get("countries");
        const root = res.data;
        const arr: ApiCountry[] = Array.isArray(root)
          ? (root as ApiCountry[])
          : Array.isArray(root?.data)
          ? (root.data as ApiCountry[])
          : [];
        const normalized: CountryItem[] = arr.map((it) => ({
          id: toNumberSafe(it?.id),
          name: toStringSafe(it?.name),
          code: toStringSafe(it?.code).toUpperCase(),
          flag: toStringSafe(it?.flag),
        }));

        const map: Record<string, LanguageItem[]> = {};
        for (const it of arr) {
          const code = toStringSafe(it?.code).toUpperCase();
          const langs: LanguageItem[] = [];
          const tenant = (it as any)?.tenant;
          const ls: ApiLanguage[] | undefined = Array.isArray(tenant?.languages)
            ? (tenant.languages as ApiLanguage[])
            : undefined;
          if (ls) {
            for (const l of ls) {
              const lc = toStringSafe(l?.code).toLowerCase();
              if (!lc) continue;
              langs.push({
                code: lc,
                name: toStringSafe(l?.name || lc),
                flag: toStringSafe(l?.flag || ""),
              });
            }
          }
          if (code) map[code] = langs;
        }

        // Build code -> id map and persist for interceptors
        try {
          const codeToId: Record<string, number> = {};
          for (const c of normalized) codeToId[c.code] = c.id;
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "COUNTRY_CODE_TO_ID",
              JSON.stringify(codeToId)
            );
          }
        } catch {}

        // Save to module cache
        countriesCache = normalized;
        codeToLangCache = map;
        countriesCachedAt = now;

        applyData(normalized, map);
      } catch (_) {
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [open]);

  // No URL change when selecting a country; only persist locally

  const onSelectCountry = (country: CountryItem, apiCountry?: ApiCountry) => {
    setSelectedCountry(country);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("preferred_country", country.code.toUpperCase());
        localStorage.setItem("preferred_country_id", String(country.id));
      }
    } catch {}
    try {
      Cookies.set("tenant_id", String(country.id), {
        path: "/",
        sameSite: "lax",
        expires: 365,
      });
    } catch {}
    // Extract languages for the selected country if available
    const langs: LanguageItem[] = [];
    if (
      apiCountry &&
      apiCountry.tenant &&
      typeof apiCountry.tenant === "object"
    ) {
      const arr = (apiCountry.tenant as { languages?: ApiLanguage[] })
        .languages;
      if (Array.isArray(arr)) {
        for (const l of arr) {
          const code = toStringSafe(l?.code).toLowerCase();
          const name = toStringSafe(l?.name || code);
          const flag = toStringSafe(l?.flag || "");
          if (code) langs.push({ code, name, flag });
        }
      }
    }
    setLanguages(langs);
  };

  const onSelectLanguage = (language: LanguageItem) => {
    const nextLocale = language.code.toLowerCase();
    try {
      localStorage.setItem("NEXT_LOCALE", nextLocale);
      localStorage.setItem("preferred_locale", nextLocale);
      Cookies.set("NEXT_LOCALE", nextLocale, {
        path: "/",
        sameSite: "lax",
        expires: 365,
      });
      // Ensure tenant switches with language based on the currently selected country
      if (selectedCountry) {
        try {
          Cookies.set("tenant_id", String(selectedCountry.id), {
            path: "/",
            sameSite: "lax",
            expires: 365,
          });
        } catch {}
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "preferred_country_id",
              String(selectedCountry.id)
            );
            localStorage.setItem(
              "preferred_country",
              (selectedCountry.code || "").toUpperCase()
            );
          }
        } catch {}
      }
    } catch {}
    // Replace the first URL segment with the new lang-country; remove any `lang` query param
    const href =
      typeof window !== "undefined"
        ? window.location.href
        : "http://localhost/";
    const url = new URL(href);
    const parts = pathname.split("/").filter(Boolean);
    const first = parts[0] || "bg-bg";
    const [, currentCountryRaw] = first.split("-");
    const currentCountry = (
      currentCountryRaw && currentCountryRaw.length >= 2
        ? currentCountryRaw
        : "bg"
    ).toLowerCase();
    const countryFromSelection = (selectedCountry?.code || "").toLowerCase();
    const nextCountry = countryFromSelection || currentCountry;
    parts[0] = `${nextLocale}-${nextCountry}`;
    url.pathname = "/" + parts.join("/");
    url.searchParams.delete("lang");
    router.push(url.pathname + url.search + url.hash);
  };

  // Close on ESC / click outside
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-[720px] bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <button
            aria-label="Close"
            onClick={onClose}
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
        </div>
        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader />
            </div>
          ) : (
            <>
              <CountrySelector
                countries={countries}
                selectedCode={selectedCountry?.code || null}
                onSelect={(c) => {
                  setSelectedCountry(c);
                  setLanguages(codeToLanguages[c.code] || []);
                  try {
                    if (typeof window !== "undefined") {
                      localStorage.setItem(
                        "preferred_country",
                        c.code.toUpperCase()
                      );
                    }
                  } catch {}
                }}
              />

              {selectedCountry && languages.length > 0 && (
                <>
                  {/* <div className="mt-2 w-full flex justify-center">
                    <span className="px-2 py-1 rounded bg-neutral-100 text-zinc-900 font-semibold uppercase">
                      {selectedCountry.code}
                    </span>
                  </div> */}
                  <LanguageSelector
                    languages={languages}
                    selectedCode={null}
                    onSelect={onSelectLanguage}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CountryLanguageSelector;
