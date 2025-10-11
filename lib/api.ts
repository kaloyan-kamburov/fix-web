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
      const preferred = localStorage.getItem("preferred_locale") || "en";

      // Also attach app-locale based on URL path if available (backend expects it)
      if (!isLogin) {
        try {
          const parts = window.location.pathname.split("/").filter(Boolean);
          const first = parts[0] || preferred || "en-bg";
          const onlyLang = (
            first.split("-")[0] ||
            preferred ||
            "en"
          ).toLowerCase();
          (config.headers as Record<string, string>)["app-locale"] = onlyLang;
        } catch {}
      }
    } catch {}

    // Attach X-Tenant-ID header from cookie/localStorage/mapping
    try {
      if (!isLogin) {
        // 1) Cookie set by selector/header bootstrap
        const tenantCookie = document.cookie
          .split(";")
          .map((c) => c.trim())
          .find((c) => c.startsWith("tenant_id="));
        let tenantId: string | null = tenantCookie
          ? decodeURIComponent(tenantCookie.split("=")[1] || "")
          : null;

        // 2) LocalStorage direct id
        if (!tenantId) tenantId = localStorage.getItem("preferred_country_id");

        // 3) From URL country and cached mapping
        if (!tenantId) {
          try {
            const parts = window.location.pathname.split("/").filter(Boolean);
            const first = parts[0] || "bg-bg";
            const [, countryRaw] = first.split("-");
            const countryCode = (countryRaw || "bg").toUpperCase();
            const mapRaw = localStorage.getItem("COUNTRY_CODE_TO_ID");
            if (mapRaw) {
              const map = JSON.parse(mapRaw) as Record<string, number>;
              const found = map[countryCode];
              if (found) tenantId = String(found);
            }
          } catch {}
        }

        if (tenantId) {
          config.headers = config.headers || {};
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
      const preferred = cookieStore?.get?.("preferred_locale")?.value || "en";
      const headersList = await nh.headers?.();
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
            const maybeLocale = parts[0] || "en";
            window.location.href = `/${maybeLocale}/login`;
          } catch {
            window.location.href = "/en/login";
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
