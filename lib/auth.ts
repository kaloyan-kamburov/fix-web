import Cookies from "js-cookie";
export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  [key: string]: unknown;
}

export interface AuthState {
  user: AuthUser;
  accessToken: string;
}

const AUTH_CHANGED_EVENT = "auth-changed";

export function getAuth(): AuthState | null {
  if (typeof window === "undefined") return null;
  try {
    const token: string | undefined = Cookies.get("auth_token");
    if (!token) return null;
    return { user: {} as AuthUser, accessToken: token };
  } catch {
    return null;
  }
}

export function setAuth(state: AuthState): void {
  if (typeof window === "undefined") return;
  try {
    Cookies.set("auth_token", state.accessToken, {
      path: "/",
      sameSite: "lax",
      expires: 30,
    });
  } catch {
    const maxAgeDays = 30;
    const maxAge = maxAgeDays * 24 * 60 * 60;
    document.cookie = `auth_token=${encodeURIComponent(
      state.accessToken
    )}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  }
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  try {
    Cookies.remove("auth_token", { path: "/" });
  } catch {
    document.cookie = `auth_token=; Path=/; Max-Age=0; SameSite=Lax`;
  }
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function isAuthenticated(): boolean {
  return !!getAuth();
}

export function onAuthChanged(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => listener();
  window.addEventListener(AUTH_CHANGED_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
