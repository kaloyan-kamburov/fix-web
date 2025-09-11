import axios from "axios";
import toast from "react-hot-toast";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://kmp-admin.perspectiveunity.com/api/client/";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "bg-BG",
  },
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

      const candidate =
        (typeof data === "string" && data) ||
        data?.message ||
        data?.error ||
        (Array.isArray(data?.errors) && data.errors[0]?.message) ||
        fallback;
      toast.error(candidate?.message);
    } catch {
      toast.error("Възникна грешка. Опитайте отново.");
    }
    return Promise.reject(error);
  }
);
