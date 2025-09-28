import axios from "axios";
import toast from "react-hot-toast";
import { clearAuth } from "@/lib/auth";
// No longer rely on localStorage for auth; attach token from cookie

// Use absolute API base on the server; proxy on the client to avoid CORS
const baseURL =
  typeof window === "undefined"
    ? (process.env.NEXT_PUBLIC_API_BASE_URL as string | undefined)
    : "/api/proxy";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
// Attach bearer token
api.interceptors.request.use(async (config) => {
  if (typeof document !== "undefined") {
    try {
      const preferred = localStorage.getItem("preferred_locale") || "en";
      const localeHeader = new Map<string, string>([
        ["bg", "bg-BG"],
        ["en", "en-US"],
        ["tr", "tr-TR"],
        ["gr", "el-GR"],
        ["nl", "nl-NL"],
        ["swe", "sv-SE"],
        ["por", "pt-PT"],
        ["cr", "hr-HR"],
        ["est", "et-EE"],
        ["fin", "fi-FI"],
        ["irl", "en-IE"],
        ["lat", "lv-LV"],
        ["lit", "lt-LT"],
        ["lux", "lb-LU"],
        ["mal", "mt-MT"],
        ["slovakian", "sk-SK"],
        ["slovenian", "sl-SI"],
      ]).get(preferred);
      if (localeHeader) {
        config.headers = config.headers || {};
        (config.headers as Record<string, string>)["Accept-Language"] =
          localeHeader;
      }
      // Also attach app-locale based on URL path if available (backend expects it)
      try {
        const parts = window.location.pathname.split("/").filter(Boolean);
        const maybeLocale = parts[0] || preferred || "en";
        (config.headers as Record<string, string>)["app-locale"] = maybeLocale;
      } catch {}
    } catch {}
    let bearerToken: string | null = null;
    const raw = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("auth_token="));
    if (raw) bearerToken = decodeURIComponent(raw.split("=")[1] || "");
    if (!bearerToken) {
      try {
        const lsToken = localStorage.getItem("auth_token");
        if (lsToken) bearerToken = lsToken;
      } catch {}
    }
    if (bearerToken) {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${bearerToken}`;
    }
    // Helpful for some backends that expect XHR
    config.headers = config.headers || {};
    (config.headers as Record<string, string>)["X-Requested-With"] =
      "XMLHttpRequest";
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
