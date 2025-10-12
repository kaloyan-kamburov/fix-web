import axios from "axios";
import toast from "react-hot-toast";
import { clearAuth } from "@/lib/auth";

// Use upstream API base (no proxy)
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
// Attach bearer token
api.interceptors.request.use(async (config) => {
  if (typeof document !== "undefined") {
    // Browser: avoid cross-site cookies; rely on bearer tokens when needed
    config.withCredentials = false;
    const urlStr = String(config.url || "");
    const isLogin = /(^|\/)client\/login(\b|$)/.test(urlStr);
    try {
      // Bootstrap defaults if missing: tenant_id (BG) and preferred_locale ('bg')
      const getCookie = (name: string): string | null => {
        try {
          const raw = document.cookie
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith(name + "="));
          return raw ? decodeURIComponent(raw.split("=")[1] || "") : null;
        } catch {
          return null;
        }
      };

      let tenantId = getCookie("tenant_id");
      let preferred = localStorage.getItem("preferred_locale") || "";

      if (!tenantId || !preferred) {
        try {
          const upstream = (baseURL || "").replace(/\/$/, "");
          if (upstream) {
            const resp = await fetch(`${upstream}/countries`, {
              method: "GET",
            });
            const data = await resp.json();
            const arr: any[] = Array.isArray(data)
              ? data
              : Array.isArray(data?.data)
              ? data.data
              : [];
            const bg = arr.find(
              (it) => String(it?.code || "").toUpperCase() === "BG"
            );
            const bgId: number | undefined = bg?.id ? Number(bg.id) : undefined;
            if (!tenantId && bgId) {
              document.cookie = `tenant_id=${bgId}; Path=/; SameSite=Lax; Max-Age=${
                60 * 60 * 24 * 365
              }`;
              tenantId = String(bgId);
            }
            if (!preferred) {
              preferred = "bg";
              try {
                localStorage.setItem("preferred_locale", preferred);
              } catch {}
            }
          }
        } catch {
          // Fallback without network
          if (!preferred) preferred = "bg";
        }
      }

      // Attach headers strictly from URL (preferred), then storage (NEXT_LOCALE / preferred_locale) and tenant_id
      if (!isLogin) {
        const nextLocaleCookie = document.cookie
          .split(";")
          .map((c) => c.trim())
          .find((c) => c.startsWith("NEXT_LOCALE="));
        const nextLocale = nextLocaleCookie
          ? decodeURIComponent(nextLocaleCookie.split("=")[1] || "")
          : "";
        // Derive from URL first: /lang-country/... → prefer country, else lang
        let urlLang = "";
        let urlCountry = "";
        try {
          const m = window.location.pathname.match(/^\/(.+?)(?:\/|$)/);
          const firstSeg = (m ? m[1] : "") || "";
          const parts = firstSeg.split("-");
          urlLang = (parts[0] || "").toLowerCase();
          urlCountry = (parts[1] || "").toLowerCase();
        } catch {}
        const appLocale = (
          urlCountry ||
          urlLang ||
          nextLocale ||
          preferred ||
          "bg"
        ).toLowerCase();
        config.headers = config.headers || {};
        (config.headers as Record<string, string>)["app-locale"] = appLocale;
        try {
          if (!preferred && appLocale) {
            localStorage.setItem("preferred_locale", appLocale);
          }
        } catch {}
        if (tenantId) {
          (config.headers as Record<string, string>)["X-Tenant-ID"] =
            String(tenantId);
        }
      }
    } catch {}
    let bearerToken: string | null = null;
    try {
      // For login, don't attach Authorization to avoid preflight/CORS issues
      if (!isLogin) {
        const lsToken = localStorage.getItem("auth_token");
        if (lsToken) bearerToken = lsToken;
        if (!bearerToken) {
          const raw = document.cookie
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith("auth_token="));
          if (raw) bearerToken = decodeURIComponent(raw.split("=")[1] || "");
        }
        if (bearerToken) {
          config.headers = config.headers || {};
          (config.headers as Record<string, string>)[
            "Authorization"
          ] = `Bearer ${bearerToken}`;
        }
      }
    } catch {}
    // Do not set X-Requested-With to avoid preflight
  } else {
    // Server-side: read cookie/header values from the incoming request context
    try {
      const nh: any = await import("next/headers");
      const cookieStore = await nh.cookies?.();
      const auth = cookieStore?.get?.("auth_token")?.value as
        | string
        | undefined;
      if (auth) {
        config.headers = config.headers || {};
        (config.headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${auth}`;
      }
      // Derive lang from URL when cookies are empty (e.g., first SSR on /it-it/...)
      const headersList = await nh.headers?.();
      let urlLang = "";
      try {
        const referer = headersList?.get?.("referer") || "";
        if (referer) {
          const u = new URL(referer);
          const m = u.pathname.match(/^\/(.+?)(?:\/|$)/);
          const firstSeg = (m ? m[1] : "") || "";
          urlLang = (firstSeg.split("-")[0] || "").toLowerCase();
        }
      } catch {}
      const preferred =
        cookieStore?.get?.("NEXT_LOCALE")?.value ||
        cookieStore?.get?.("preferred_locale")?.value ||
        urlLang ||
        "bg";
      const acceptLang = headersList?.get?.("accept-language") || "en-US";
      config.headers = config.headers || {};
      (config.headers as Record<string, string>)["app-locale"] = preferred;
      // Attach X-Tenant-ID if available on server via cookie
      const tenantId = cookieStore?.get?.("tenant_id")?.value as
        | string
        | undefined;
      if (tenantId) {
        (config.headers as Record<string, string>)["X-Tenant-ID"] = tenantId;
      }
      (config.headers as Record<string, string>)["Accept-Language"] =
        acceptLang as string;
      (config.headers as Record<string, string>)["X-Requested-With"] =
        "XMLHttpRequest";
    } catch {}
  }
  console.log(config);
  // console.debug('api request', config);
  return config;
});

// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const status = error?.response?.status;
      const data = error?.response?.data;

      const fallback = status
        ? `Възникна грешка (${status}). Опитайте отново.`
        : "Възникна грешка. Опитайте отново.";

      let candidate: string | undefined;
      if (typeof data === "string") {
        candidate = data;
      } else if (data?.message) {
        candidate = String(data.message?.title || data.message);
      } else if (data?.error) {
        candidate = String(data.error);
      } else if (data?.errors) {
        const errs = data.errors;
        if (Array.isArray(errs)) {
          candidate = errs[0]?.message || errs[0];
        } else if (typeof errs === "object" && errs !== null) {
          for (const key of Object.keys(errs)) {
            const val = (errs as Record<string, unknown>)[key];
            if (Array.isArray(val) && typeof val[0] === "string") {
              candidate = val[0];
              break;
            }
          }
        }
      }
      if (status === 401) {
        if (typeof window !== "undefined") {
          try {
            clearAuth();
          } catch {}
          toast?.error?.("Session expired. Please login again.");
          try {
            const parts = window.location.pathname.split("/").filter(Boolean);
            const maybeLocale = parts[0] || "bg-bg";
            window.location.href = `/${maybeLocale}/login`;
          } catch {
            window.location.href = `bg-bg/login`;
          }
        }
      } else {
        toast?.error?.(candidate || JSON.stringify(error) || fallback, {
          duration: 5000,
        });
      }
    } catch {
      toast?.error?.("An error occurred. Please try again.");
    }
    return Promise.reject(error);
  }
);
