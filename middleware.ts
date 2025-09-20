import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = [
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

  // Redirect root to default locale
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/en", req.url));
  }

  const segments = pathname.split("/").filter(Boolean);
  // No longer support ?lang as locale switcher

  // Determine effective locale from path when no lang param
  const maybeLocale = segments[0] || "";
  const effectiveLocale = locales.includes(maybeLocale) ? maybeLocale : null;
  const section = segments[1];

  if (effectiveLocale && protectedRoutes.includes(section ?? "")) {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      const nextUrl = new URL(`/${effectiveLocale}/login`, req.url);
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
