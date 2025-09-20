"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { createPortal } from "react-dom";
import CountryLanguageSelector from "../CountryLangaugeSelector/CountryLanguageSelector";

type Country = {
  id: number;
  name: string;
  code: string; // ISO-2 uppercase
  flag: string; // image url
};

// API response shapes
type ApiLanguage = {
  name?: unknown;
  code?: unknown;
  flag?: unknown;
};

type ApiCountry = {
  id?: unknown;
  name?: unknown;
  code?: unknown;
  flag?: unknown;
  tenant?:
    | {
        languages?: ApiLanguage[] | unknown;
      }
    | unknown;
};

// Cache flags to avoid refetching on every mount/navigation
const COUNTRIES_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const COUNTRIES_LS_KEY = "COUNTRIES_CACHE_V1";
let countriesCache: Country[] | null = null;
let countriesCacheAt: number | null = null;
let languageFlagsCache: Record<string, string> | null = null; // locale -> flag url

// Supported locales in the app (must match middleware.ts)
const supportedLocales = [
  "bg",
  "en",
  "fr",
  "de",
  "it",
  "es",
  "tr",
  "gr",
  "nl",
  "swe",
  "por",
  "cr",
  "est",
  "fin",
  "irl",
  "lat",
  "lit",
  "lux",
  "mal",
  "slovakian",
  "slovenian",
] as const;

// Map locale -> representative ISO-2 country code for picking a flag
const localeToCountryCode: Record<(typeof supportedLocales)[number], string> = {
  bg: "BG",
  en: "GB",
  fr: "FR",
  de: "DE",
  it: "IT",
  es: "ES",
  tr: "TR",
  gr: "GR",
  nl: "NL",
  swe: "SE",
  por: "PT",
  cr: "HR",
  est: "EE",
  fin: "FI",
  irl: "IE",
  lat: "LV",
  lit: "LT",
  lux: "LU",
  mal: "MT",
  slovakian: "SK",
  slovenian: "SI",
};

function getLocaleFromPath(pathname: string): string | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  const candidate = parts[0];
  const locales = new Set<string>(supportedLocales as unknown as string[]);
  return locales.has(candidate) ? candidate : null;
}

export function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = React.useMemo(() => {
    return getLocaleFromPath(pathname) || "bg";
  }, [pathname]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [countries, setCountries] = React.useState<Country[]>([]);
  const [langFlags, setLangFlags] = React.useState<Record<
    string,
    string
  > | null>(null);

  type LanguageItem = { locale: string; flag: string };

  const countryByCode = React.useMemo(() => {
    const map = new Map<string, Country>();
    for (const c of countries) map.set((c.code || "").toUpperCase(), c);
    return map;
  }, [countries]);

  const supportedSet = React.useMemo(
    () => new Set<string>(supportedLocales as unknown as string[]),
    []
  );

  const fallbackFlagFor = (loc: string): string => {
    const code = localeToCountryCode[loc as (typeof supportedLocales)[number]];
    const country = countryByCode.get(code);
    if (country?.flag) return country.flag;
    const lower = (code || "").toLowerCase();
    if (!lower) return "";
    return `https://kmp-admin.perspectiveunity.com/flags/${lower}.png`;
  };

  const displayLocale = (loc: string): string => {
    if (loc === "slovakian") return "SK";
    if (loc === "slovenian") return "SLO";
    return loc;
  };

  const items = React.useMemo<LanguageItem[]>(() => {
    return (supportedLocales as unknown as string[]).map((loc) => ({
      locale: loc,
      flag: (langFlags && langFlags[loc]) || fallbackFlagFor(loc),
    }));
  }, [langFlags, supportedSet, countryByCode]);

  React.useEffect(() => {
    let active = true;
    const now = Date.now();

    const setIfActive = (arr: Country[]) => {
      if (!active) return;
      setCountries(arr);
    };

    // 1) In-memory cache
    if (
      Array.isArray(countriesCache) &&
      typeof countriesCacheAt === "number" &&
      now - countriesCacheAt < COUNTRIES_CACHE_TTL_MS
    ) {
      setIfActive(countriesCache);
      if (languageFlagsCache) setLangFlags(languageFlagsCache);
      return () => {
        active = false;
      };
    }

    // 2) LocalStorage cache
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(COUNTRIES_LS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const cachedAt = Number(parsed?.at ?? 0);
          const arr = Array.isArray(parsed?.countries) ? parsed.countries : [];
          const langFlags =
            parsed?.langFlags && typeof parsed.langFlags === "object"
              ? parsed.langFlags
              : null;
          if (
            cachedAt &&
            now - cachedAt < COUNTRIES_CACHE_TTL_MS &&
            arr.length
          ) {
            countriesCache = arr;
            countriesCacheAt = cachedAt;
            languageFlagsCache = langFlags;
            if (langFlags) setLangFlags(langFlags);
            setIfActive(arr);
            return () => {
              active = false;
            };
          }
        }
      }
    } catch {}

    // 3) Fetch from API and cache
    fetch("https://kmp-admin.perspectiveunity.com/api/countries")
      .then((r) => r.json())
      .then((raw: unknown) => {
        if (!active) return;
        const root = ((): ApiCountry[] => {
          if (Array.isArray(raw)) return raw as ApiCountry[];
          if (
            raw &&
            typeof raw === "object" &&
            Array.isArray((raw as { data?: unknown }).data)
          ) {
            return (raw as { data: unknown }).data as ApiCountry[];
          }
          return [];
        })();

        const toStringSafe = (v: unknown): string =>
          typeof v === "string" ? v : String(v ?? "");
        const toNumberSafe = (v: unknown): number => {
          if (typeof v === "number") return v;
          const n = Number(v);
          return Number.isFinite(n) ? n : 0;
        };

        const normalized: Country[] = root.map((item: ApiCountry) => {
          const id = toNumberSafe(item?.id);
          const name = toStringSafe(item?.name);
          const codeRaw = toStringSafe((item as ApiCountry)?.code);
          const code = codeRaw.toUpperCase();
          const flag = toStringSafe((item as ApiCountry)?.flag);
          return { id, name, code, flag };
        });

        // Build language flags from nested tenant.languages
        const langMap: Record<string, string> = {};
        for (const it of root) {
          const tenant =
            it && typeof it === "object"
              ? (it as ApiCountry).tenant
              : undefined;
          const languages =
            tenant && typeof tenant === "object"
              ? (tenant as { languages?: unknown }).languages
              : undefined;
          if (Array.isArray(languages)) {
            for (const l of languages as ApiLanguage[]) {
              const lc = toStringSafe(l?.code).toLowerCase();
              const lf = toStringSafe(l?.flag);
              if (lc && lf && !langMap[lc]) langMap[lc] = lf;
            }
          }
        }
        languageFlagsCache = langMap;
        setLangFlags(langMap);

        countriesCache = normalized;
        countriesCacheAt = Date.now();
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem(
              COUNTRIES_LS_KEY,
              JSON.stringify({
                at: countriesCacheAt,
                countries: normalized,
                langFlags: languageFlagsCache,
              })
            );
          }
        } catch {}

        setIfActive(normalized);
      })
      .catch(() => {
        // silent fail
      });
    return () => {
      active = false;
    };
  }, []);

  const onSelect = (nextLocale: string) => {
    try {
      localStorage.setItem("NEXT_LOCALE", nextLocale);
      Cookies.set("NEXT_LOCALE", nextLocale, {
        path: "/",
        sameSite: "lax",
        expires: 365,
      });
    } catch {}

    const search = typeof window !== "undefined" ? window.location.search : "";
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const parts = pathname.split("/").filter(Boolean);
    const locales = new Set<string>(supportedLocales as unknown as string[]);
    if (parts.length > 0 && locales.has(parts[0])) {
      parts[0] = nextLocale;
    } else {
      parts.unshift(nextLocale);
    }
    const nextPath = "/" + parts.join("/") + search + hash;
    router.push(nextPath);
    setIsOpen(false);
  };

  const selected = React.useMemo<LanguageItem | null>(() => {
    const entry = items.find((i) => i.locale === currentLocale);
    if (entry) return entry;
    const fallback = fallbackFlagFor(currentLocale);
    if (fallback) return { locale: currentLocale, flag: fallback };
    return null;
  }, [items, currentLocale, countryByCode]);

  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!isOpen) return;
      const el = rootRef.current;
      if (el && !el.contains(e.target as Node)) setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        className={`flex items-center gap-2 px-2 py-1 rounded border border-neutral-400 cursor-pointer ${
          isOpen ? "bg-white hover:bg-gray-50" : "bg-transparent"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setShowModal(true)}
      >
        {selected?.flag ? (
          <Image
            src={selected.flag}
            alt={currentLocale}
            width={20}
            height={14}
          />
        ) : (
          <span className="w-5 h-3 bg-neutral-400 inline-block" />
        )}
        <span
          className={`text-sm uppercase ${
            isOpen ? "text-background" : "text-white"
          }`}
        >
          {displayLocale(currentLocale)}
        </span>
      </button>
      {showModal &&
        typeof document !== "undefined" &&
        createPortal(
          <CountryLanguageSelector
            open={showModal}
            onClose={() => setShowModal(false)}
          />,
          document.body
        )}
    </div>
  );
}
