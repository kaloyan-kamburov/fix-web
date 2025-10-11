import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Supported language codes (first segment part before '-')
const languages = [
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
];

const protectedRoutes = ["orders", "profile"];

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname, searchParams } = url;

  // Never touch Next.js API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Redirect root to default lang-country
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/bg-bg", req.url));
  }

  const segments = pathname.split("/").filter(Boolean);
  // No longer support ?lang as locale switcher

  // Expect first segment to be lang-country, where lang is supported; default to bg-bg
  const first = segments[0] || "";
  const [langRaw, countryRaw] = first.split("-");
  const lang = languages.includes(langRaw || "") ? langRaw : "bg";
  const country = countryRaw && countryRaw.length >= 2 ? countryRaw : "bg";

  // Normalize if first segment is only language or invalid
  const normalized = `${lang}-${country}`;
  if (first !== normalized) {
    const norm = new URL(
      `/${normalized}${pathname.slice(first.length + 1) || ""}${url.search}`,
      req.url
    );
    return NextResponse.redirect(norm);
  }

  const section = segments[1];

  if (languages.includes(lang) && protectedRoutes.includes(section ?? "")) {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      const nextUrl = new URL(`/${normalized}/login`, req.url);
      const lp = url.searchParams.get("lang");
      if (lp) nextUrl.searchParams.set("lang", lp);
      return NextResponse.redirect(nextUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on all paths except Next.js internals and assets
  matcher: "/((?!_next|.*\\..*).*)",
};
