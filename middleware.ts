import createMiddleware from "next-intl/middleware";

const locales = [
  "bg",
  "en",
  "fr",
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

export default createMiddleware({
  locales,
  defaultLocale: "bg",
  localePrefix: "always",
  localeDetection: true,
});

export const config = {
  matcher: [
    "/",
    "/(bg|en|fr|tr|gr|nl|swe|por|cr|est|fin|irl|lat|lit|lux|mal|slovakian|slovenian)/:path*",
    "/((?!api|_next|.*\\..*).*)",
  ],
};
