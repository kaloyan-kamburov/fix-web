"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

type Country = {
  id: number;
  name: string;
  code: string; // ISO-2 uppercase
  flag: string; // image url
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
  const currentLocale = React.useMemo(
    () => getLocaleFromPath(pathname) || "bg",
    [pathname]
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [countries, setCountries] = React.useState<Country[]>([]);
  const [langFlags, setLangFlags] = React.useState<Record<
    string,
    string
  > | null>(null);

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

  const items = React.useMemo(() => {
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
        const arr = Array.isArray(raw)
          ? raw
          : Array.isArray((raw as any)?.data)
          ? (raw as any).data
          : [];
        const normalized: Country[] = (arr as any[]).map((item) => ({
          id: Number((item as any)?.id ?? 0),
          name: String((item as any)?.name ?? ""),
          code: String(
            (item as any)?.code ??
              (item as any)?.iso2 ??
              (item as any)?.countryCode ??
              ""
          ).toUpperCase(),
          flag: String(
            (item as any)?.flag ??
              (item as any)?.flagUrl ??
              (item as any)?.image ??
              ""
          ),
        }));

        // Build language flags from nested tenant.languages
        try {
          const langMap: Record<string, string> = {};
          for (const it of arr as any[]) {
            const langs = (it as any)?.tenant?.languages;
            if (Array.isArray(langs)) {
              for (const l of langs) {
                const code = String((l as any)?.code || "").toLowerCase();
                const flag = String((l as any)?.flag || "");
                if (code && flag && !langMap[code]) langMap[code] = flag;
              }
            }
          }
          languageFlagsCache = langMap;
          setLangFlags(langMap);
        } catch {}

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
    router.push(nextPath as any);
    setIsOpen(false);
  };

  const selected = React.useMemo(() => {
    const entry = items.find((i) => i.locale === currentLocale);
    if (entry) return entry;
    const fallback = fallbackFlagFor(currentLocale);
    if (fallback) return { locale: currentLocale, flag: fallback } as any;
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
        onClick={() => setIsOpen((v) => !v)}
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
      {isOpen && (
        <ul
          className="absolute right-0 mt-2 w-44 rounded-md border border-[#dadade] bg-white text-background shadow-lg z-50 max-h-80 overflow-auto"
          role="listbox"
        >
          {items.map((i) => (
            <li
              role="option"
              aria-selected={i.locale === currentLocale}
              key={i.locale}
              onClick={() => onSelect(i.locale)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-10 cursor-pointer"
            >
              {i.flag ? (
                <Image src={i.flag} alt={i.locale} width={20} height={14} />
              ) : (
                <span className="w-5 h-3 bg-neutral-300 inline-block" />
              )}
              <span className="text-sm uppercase">
                {displayLocale(i.locale)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
