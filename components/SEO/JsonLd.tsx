"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";

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
    (async () => {
      try {
        const origin = window.location.origin;
        const url = `${origin}${pathname || "/"}`;
        const segments = (pathname || "/").split("/").filter(Boolean);
        const firstSeg = segments[0] || ""; // lang-country
        const lang = (firstSeg.split("-")[0] || "bg").toLowerCase();
        const siteName = document.title || window.location.hostname;

        const data: any = {
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
        };

        // Augment with category/service details
        const section = segments[1]; // e.g., 'categories' or 'emergencies'
        const categorySlug = segments[2];
        const maybeServiceSlug = segments[3];

        // Category page: /{locale}/(categories|emergencies)/{category}
        if (
          (section === "categories" || section === "emergencies") &&
          categorySlug &&
          !maybeServiceSlug
        ) {
          // Avoid 404 for pseudo-category path like /categories/emergencies
          if (!(section === "categories" && categorySlug === "emergencies")) {
            try {
              const res = await api.get(`categories/${categorySlug}`);
              const cat: any = res?.data;
              const categoryName = cat
                ? typeof cat === "object" &&
                  cat !== null &&
                  typeof cat.name === "string"
                  ? cat.name
                  : Array.isArray(cat?.data) && cat.data.length
                  ? String(cat.data[0]?.name || "")
                  : ""
                : "";
              if (categoryName) data.category = categoryName;
            } catch {}
          }
        }

        // Service page: /{locale}/(categories|emergencies)/{category}/{service}
        if (
          (section === "categories" || section === "emergencies") &&
          categorySlug &&
          maybeServiceSlug
        ) {
          // Fetch category name; skip pseudo-category 'emergencies' under categories to avoid 404
          if (!(section === "categories" && categorySlug === "emergencies")) {
            try {
              const resCat = await api.get(`categories/${categorySlug}`);
              const cat: any = resCat?.data;
              const categoryName = cat
                ? typeof cat === "object" &&
                  cat !== null &&
                  typeof cat.name === "string"
                  ? cat.name
                  : Array.isArray(cat?.data) && cat.data.length
                  ? String(cat.data[0]?.name || "")
                  : ""
                : "";
              if (categoryName) data.category = categoryName;
            } catch {}
          }

          // Fetch service details
          try {
            const resSvc = await api.get(`services/${maybeServiceSlug}`);
            const s: any = resSvc?.data || {};
            const serviceName = String(s?.name || "");
            const priceFrom =
              s?.price_from != null ? String(s.price_from) : undefined;
            const priceTo =
              s?.price_to != null ? String(s.price_to) : undefined;
            const currency = String(
              s?.currency?.symbol || s?.currency?.code || ""
            );
            if (serviceName) data.serviceName = serviceName;
            if (priceFrom) data.priceFrom = priceFrom;
            if (priceTo) data.priceTo = priceTo;
            if (currency) data.currency = currency;
          } catch {}
        }

        setJson(JSON.stringify(data));
      } catch {
        setJson(null);
      }
    })();
  }, [pathname, shouldExclude]);

  if (!json) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
