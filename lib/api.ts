import axios from "axios";
import toast from "react-hot-toast";
import { clearAuth } from "@/lib/auth";
// No longer rely on localStorage for auth; attach token from cookie

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://kmp-admin.perspectiveunity.com/api/";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "bg-BG",
  },
});
// Attach bearer token
api.interceptors.request.use((config) => {
  console.log("dsasadsa");
  if (typeof document !== "undefined") {
    const raw = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("auth_token="));
    if (raw) {
      const token = decodeURIComponent(raw.split("=")[1] || "");
      console.log(token);
      if (token) {
        config.headers = config.headers || {};
        (config.headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${token}`;
      }
    }
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
        candidate = String(data.message);
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
          toast.error("Сесията е изтекла. Моля, влезте отново.");
          window.location.href = "/login";
        }
      } else {
        toast.error(candidate || fallback);
      }
    } catch {
      toast.error("Възникна грешка. Опитайте отново.");
    }
    return Promise.reject(error);
  }
);
