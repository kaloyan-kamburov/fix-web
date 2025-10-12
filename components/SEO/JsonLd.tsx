"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

type JsonLdProps = {
  excludePrefixes?: string[];
};

export default function JsonLd({ excludePrefixes = [] }: JsonLdProps) {
  const pathname = usePathname();
  const [json, setJson] = React.useState<string | null>(null);

  const shouldExclude = React.useMemo(() => {
    if (!pathname) return false;
    return excludePrefixes.some((p) => pathname.startsWith(p));
  }, [excludePrefixes, pathname]);

  React.useEffect(() => {
    if (shouldExclude) {
      setJson(null);
      return;
    }
    try {
      const origin = window.location.origin;
      const url = `${origin}${pathname || "/"}`;
      const m = (pathname || "/").match(/^\/(.+?)(?:\/|$)/);
      const firstSeg = (m ? m[1] : "") || ""; // lang-country
      const lang = (firstSeg.split("-")[0] || "bg").toLowerCase();
      const siteName = document.title || window.location.hostname;

      const data = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": url + "#webpage",
        url,
        name: siteName,
        inLanguage: lang,
        isPartOf: {
          "@type": "WebSite",
          "@id": origin + "#website",
          url: origin,
          name: siteName,
          inLanguage: lang,
        },
      } as const;
      setJson(JSON.stringify(data));
    } catch {
      setJson(null);
    }
  }, [pathname, shouldExclude]);

  if (!json) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
