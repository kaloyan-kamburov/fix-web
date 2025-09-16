import createMiddleware from "next-intl/middleware";
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

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "bg",
  localePrefix: "always",
  localeDetection: true,
});

export default function middleware(req: NextRequest) {
  const res = intlMiddleware(req);

  const pathname = req.nextUrl.pathname;
  const ordersRegex = new RegExp(
    `^/(bg|en|fr|de|it|es|tr|gr|nl|swe|por|cr|est|fin|irl|lat|lit|lux|mal|slovakian|slovenian)/orders(?:/|$)`
  );

  if (ordersRegex.test(pathname)) {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      const locale = pathname.split("/")[1] || "bg";
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/",
    "/(bg|en|fr|de|it|es|tr|gr|nl|swe|por|cr|est|fin|irl|lat|lit|lux|mal|slovakian|slovenian)/:path*",
    "/((?!api|_next|.*\\..*).*)",
  ],
};
