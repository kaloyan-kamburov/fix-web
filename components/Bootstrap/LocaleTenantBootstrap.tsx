"use client";

import { useEffect } from "react";

export default function LocaleTenantBootstrap() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const hasTenant = document.cookie
          .split(";")
          .map((c) => c.trim())
          .some((c) => c.startsWith("tenant_id="));
        let preferred = localStorage.getItem("preferred_locale") || "";

        // Seed preferred_locale (and NEXT_LOCALE) from URL if missing
        if (!preferred) {
          try {
            const m = window.location.pathname.match(/^\/(.+?)(?:\/|$)/);
            const firstSeg = (m ? m[1] : "") || ""; // lang-country
            const langPart = (firstSeg.split("-")[0] || "bg").toLowerCase();
            preferred = langPart;
            localStorage.setItem("preferred_locale", preferred);
            // Set NEXT_LOCALE cookie as well
            document.cookie = `NEXT_LOCALE=${preferred}; Path=/; SameSite=Lax; Max-Age=${
              60 * 60 * 24 * 365
            }`;
          } catch {
            // fallback to bg
            preferred = "bg";
            try {
              localStorage.setItem("preferred_locale", preferred);
            } catch {}
          }
        }
        if (hasTenant && preferred) return;

        const upstream = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
          /\/$/,
          ""
        );
        if (!upstream) {
          if (!preferred) localStorage.setItem("preferred_locale", "bg");
          return;
        }

        const resp = await fetch(`${upstream}/countries`, { method: "GET" });
        if (!resp.ok) {
          return;
        }
        const data = await resp.json();
        if (cancelled) return;
        const arr: any[] = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.data)
          ? (data as any).data
          : [];
        const bg = arr.find(
          (it) => String(it?.code || "").toUpperCase() === "BG"
        );
        const bgId: number | undefined = bg?.id ? Number(bg.id) : undefined;
        if (!hasTenant && bgId) {
          document.cookie = `tenant_id=${bgId}; Path=/; SameSite=Lax; Max-Age=${
            60 * 60 * 24 * 365
          }`;
        }
        // preferred already set above from URL
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
