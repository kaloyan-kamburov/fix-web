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
  const { pathname } = req.nextUrl;

  // Redirect root to default locale
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/bg", req.url));
  }

  // Protect only localized orders pages
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];
  const section = segments[1];
  const isLocalized = locales.includes(locale ?? "");

  if (isLocalized && protectedRoutes.includes(section ?? "")) {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", // redirect root
    `/(${locales.join("|")})/(${protectedRoutes.join("|")})/:path*`, // protect orders
  ],
};
