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
  // Ensure Content-Type remains correct when proxying JSON (avoid [object Object])
  if (!headers.get("content-type") && req.headers.get("content-type")) {
    headers.set("content-type", req.headers.get("content-type") as string);
  }

  // Promote auth_token cookie to Authorization header if present
  const authCookie = req.cookies.get("auth_token")?.value;
  if (authCookie) {
    headers.set("Authorization", `Bearer ${authCookie}`);
  }

  // Ensure locale headers are present
  const segments = req.nextUrl.pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0] || "en";
  if (!headers.get("app-locale")) headers.set("app-locale", maybeLocale);
  if (!headers.get("Accept-Language"))
    headers.set("Accept-Language", maybeLocale);
  headers.set("X-Requested-With", "XMLHttpRequest");

  const init: RequestInit & { duplex?: "half" } = {
    method: req.method,
    headers,
    // Forward the raw body stream to preserve multipart/form-data uploads
    body: ["GET", "HEAD"].includes(req.method) ? undefined : (req as any).body,
    cache: "no-store",
    // Required by Node 18/undici when streaming a request body
    duplex: "half",
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
