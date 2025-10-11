import { NextRequest, NextResponse } from "next/server";

function buildTargetUrl(
  base: string | undefined,
  pathSegments: string[],
  req: NextRequest
): string {
  const baseUrl = (base || "").replace(/\/$/, "");
  const path = "/" + pathSegments.join("/");
  const qs = req.nextUrl.search;
  return `${baseUrl}${path}${qs}`;
}

async function handle(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const target = buildTargetUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL,
    path,
    req
  );

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("content-length");

  // Promote auth_token cookie to Authorization header if present
  const authCookie = req.cookies.get("auth_token")?.value;
  if (authCookie) {
    headers.set("Authorization", `Bearer ${authCookie}`);
  }

  // Attach tenant header if available via cookie; fallback to env mapping by country code
  const tenantCookie = req.cookies.get("tenant_id")?.value;
  if (tenantCookie) {
    headers.set("X-Tenant-ID", String(tenantCookie));
  } else {
    try {
      const segments = req.nextUrl.pathname.split("/").filter(Boolean);
      const first = segments[0] || "bg-bg";
      const [, countryRaw] = first.split("-");
      const code = (countryRaw || "bg").toUpperCase();
      const envKey = `TENANT_ID_${code}`;
      const envVal = (process.env as Record<string, string | undefined>)[
        envKey
      ];
      if (envVal) headers.set("X-Tenant-ID", envVal);
      // Final fallback: try to resolve from upstream /countries
      if (!headers.get("X-Tenant-ID")) {
        const upstream = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
          /\/$/,
          ""
        );
        if (upstream) {
          try {
            const langForFetch = (first.split("-")[0] || "en").toLowerCase();
            const resp = await fetch(`${upstream}/countries`, {
              method: "GET",
              headers: {
                Accept: "application/json",
                "app-locale": langForFetch,
                "Accept-Language": langForFetch,
                "X-Requested-With": "XMLHttpRequest",
              },
              cache: "no-store",
            });
            if (resp.ok) {
              const data = await resp.json();
              const arr: any[] = Array.isArray(data)
                ? data
                : Array.isArray((data as any)?.data)
                ? (data as any).data
                : [];
              const match = arr.find(
                (it) => String(it?.code || "").toUpperCase() === code
              );
              if (match?.id) headers.set("X-Tenant-ID", String(match.id));
            }
          } catch {}
        }
      }
    } catch {}
  }

  // Ensure locale headers are present (use language for app-locale)
  const segments = req.nextUrl.pathname.split("/").filter(Boolean);
  const first = segments[0] || "en-bg";
  const lang = (first.split("-")[0] || "en").toLowerCase();
  if (!headers.get("app-locale")) headers.set("app-locale", lang);
  if (!headers.get("Accept-Language")) headers.set("Accept-Language", lang);
  headers.set("X-Requested-With", "XMLHttpRequest");

  const hasBody = !["GET", "HEAD"].includes(req.method);
  const hasStreamBody = hasBody && Boolean((req as any).body);
  if (!hasStreamBody) {
    headers.delete("content-type");
  }
  const init: RequestInit & { duplex?: "half" } = {
    method: req.method,
    headers,
    body: hasStreamBody ? ((req as any).body as any) : undefined,
    cache: "no-store",
    ...(hasStreamBody ? { duplex: "half" as const } : {}),
  };

  const resp = await fetch(target, init);
  const blob = await resp.blob();
  const out = new NextResponse(blob, {
    status: resp.status,
    statusText: resp.statusText,
  });
  // Pass through content-related headers
  const passthrough = ["content-type", "content-disposition", "content-length"];
  for (const h of passthrough) {
    const v = resp.headers.get(h);
    if (v) out.headers.set(h, v);
  }
  return out;
}

export {
  handle as GET,
  handle as POST,
  handle as PUT,
  handle as PATCH,
  handle as DELETE,
  handle as OPTIONS,
};
