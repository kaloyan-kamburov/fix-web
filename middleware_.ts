// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    const segments = request.nextUrl.pathname.split("/").filter(Boolean);
    const locale = segments[0] || "bg";
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }
  return NextResponse.next();
}

const langs = [
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

const protectedRoutes = ["orders"];

// Protect only certain routes
// export const config = {
//   matcher: [`/(${langs.join("|")})/(${protectedRoutes.join("|")})*`],
// };
