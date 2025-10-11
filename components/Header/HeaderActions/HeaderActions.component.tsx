"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { BellIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { clearAuth, getAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { useLocale, useTranslations } from "next-intl";
import formatDate from "@/lib/formatDate";
import { useNotifications } from "../NotificationsProvider";
export default function HeaderActions({
  onlyNotifications = false,
  onNotificationsOpen,
}: {
  onlyNotifications?: boolean;
  onNotificationsOpen?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const notificationsRef = React.useRef<HTMLDivElement | null>(null);
  const [isLoadingLogout, setIsLoadingLogout] = React.useState(false);
  const t = useTranslations();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const locale = useLocale();
  const { notifications, refresh } = useNotifications();
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const updateNotification = async (id: string) => {
    await api.put(`client/notifications/${id}`, {
      is_read: true,
    });
    await refresh();
  };

  const localePrefix = React.useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    const first = parts[0];
    return first ? `/${first}` : "/bg-bg";
  }, [pathname]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsProfileMenuOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const onLogout = async () => {
    setIsLoadingLogout(true);
    try {
      // Skip network request if there is no active auth
      if (!getAuth()) {
        return;
      }
      // Try to forward bearer token explicitly to avoid cookie-only failures
      let token: string | null = null;
      try {
        const raw = document.cookie
          .split(";")
          .map((c) => c.trim())
          .find((c) => c.startsWith("auth_token="));
        if (raw) token = decodeURIComponent(raw.split("=")[1] || "");
        if (!token) token = localStorage.getItem("auth_token");
      } catch {}
      let tenantId: string | null = null;
      try {
        const raw = document.cookie
          .split(";")
          .map((c) => c.trim())
          .find((c) => c.startsWith("tenant_id="));
        if (raw) tenantId = decodeURIComponent(raw.split("=")[1] || "");
        if (!tenantId) tenantId = localStorage.getItem("preferred_country_id");
        if (!tenantId) {
          const parts = window.location.pathname.split("/").filter(Boolean);
          const first = parts[0] || "bg-bg";
          const [, countryRaw] = first.split("-");
          const code = (countryRaw || "bg").toUpperCase();
          const mapRaw = localStorage.getItem("COUNTRY_CODE_TO_ID");
          if (mapRaw) {
            const map = JSON.parse(mapRaw) as Record<string, number>;
            const found = map[code];
            if (found) tenantId = String(found);
          }
        }
      } catch {}

      const parts = pathname.split("/").filter(Boolean);
      const first = parts[0] || "bg-bg";
      const appLang = (first.split("-")[0] || "bg").toLowerCase();
      await api.post(
        "logout",
        {},
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(tenantId ? { "X-Tenant-ID": String(tenantId) } : {}),
            "app-locale": appLang,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (e) {
      // ignore, interceptor will handle toast; we'll still clear locally
    } finally {
      clearAuth();
      setIsProfileMenuOpen(false);
      // Preserve locale in URL if present
      const parts = pathname.split("/").filter(Boolean);
      const first = parts[0];
      const target = first ? `/${first}` : "/bg-bg";
      router.push(target);
      setIsLoadingLogout(false);
    }
  };

  return (
    <>
      <nav className="flex gap-3 items-center">
        <div className="relative" ref={notificationsRef}>
          <button
            className={`flex gap-2 items-center self-stretch p-2 my-auto w-11 h-11 rounded border border-solid border-neutral-400 cursor-pointer ${
              isNotificationsOpen
                ? "bg-white border-transparent"
                : "border-neutral-400"
            }`}
            aria-label={t("notifications")}
            aria-haspopup="menu"
            aria-expanded={isNotificationsOpen}
            onClick={() => {
              setIsNotificationsOpen((v) => {
                const next = !v;
                if (next && onNotificationsOpen) onNotificationsOpen();
                return next;
              });
              setIsProfileMenuOpen(false);
            }}
          >
            <BellIcon
              className={isNotificationsOpen ? "text-background" : "text-white"}
            />
            {Array.isArray(notifications) &&
              notifications.filter((n) => !n.is_read).length > 0 && (
                <div className="absolute flex items-center text-white justify-center top-[-7px] right-[-7px] w-[20px] h-[20px] p-[4px] text-[10px] bg-red-500 rounded-full">
                  {notifications.filter((n) => !n.is_read).length > 9
                    ? "9+"
                    : notifications.filter((n) => !n.is_read).length}
                </div>
              )}
          </button>
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-md bg-white text-background shadow-lg z-50 overflow-hidden w-[420px] max-sm:w-[360px] max-sm:right-[-56px]">
              <div className="max-h-[500px] overflow-y-auto ">
                <div className="sticky top-0 bg-white z-10 p-5 max-sm:p-2 font-semibold text-sm max-sm:justify-center max-sm:flex">
                  {t("newNotifications")}
                </div>
                <div className="p-5 pt-0 max-sm:p-2">
                  {(Array.isArray(notifications) ? notifications : [])
                    .length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      {t("noNotifications")}
                    </div>
                  ) : (
                    (notifications as any[]).map((n) => {
                      let link = `${localePrefix}/requests/${n?.object_id}`;
                      if (n?.type === "offer_created") {
                        link = `${localePrefix}/offers/${n?.object_id}`;
                      }
                      return (
                        <Link
                          href={link}
                          key={String(n?.id)}
                          onClick={() => {
                            setIsNotificationsOpen(false);
                            if (!n.is_read || n.is_read === 0) {
                              updateNotification(n?.id);
                            }
                          }}
                          className="px-4 py-3 flex items-center gap-3 border-b border-gray-10 last:border-b-0 hover:bg-gray-10 cursor-pointer relative"
                        >
                          {!n.is_read && (
                            <div className="absolute top-5 left-2 w-2 h-2 bg-red-500 rounded-full" />
                          )}
                          <div>
                            {n?.type === "offer_created" && (
                              <div className="rounded-full bg-gray-10 w-12 h-12 flex items-center justify-center">
                                <svg
                                  width="18"
                                  height="19"
                                  viewBox="0 0 18 19"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M17.5631 2.66283C17.4445 2.63523 17.3198 2.67107 17.2341 2.75759L15.7766 4.2266H15.0778L14.3086 3.42968V2.7212L15.7453 1.26317C15.8303 1.17693 15.8649 1.05292 15.8367 0.934955C15.8087 0.817127 15.7219 0.722095 15.6071 0.683368C15.2462 0.561694 14.8685 0.500033 14.4844 0.500033C13.3393 0.500033 12.299 1.03397 11.6302 1.96492C11.0042 2.83642 10.8113 3.90443 11.0877 4.92657L8.49805 7.51618L4.18358 3.19196V2.34327C4.18358 2.21981 4.11876 2.10527 4.01288 2.04183L1.52701 0.550159C1.38858 0.467074 1.21155 0.48891 1.09757 0.60303L0.103275 1.59716C-0.010712 1.71128 -0.032548 1.88829 0.0504013 2.02672L1.54184 4.51252C1.60529 4.6184 1.71969 4.68308 1.84315 4.68322L2.6916 4.68349L7.00647 9.00772L4.42666 11.5874C3.40449 11.3111 2.3359 11.5044 1.46397 12.1307C0.53354 12.7991 0 13.8391 0 14.9841C0 15.3681 0.0616627 15.7459 0.18334 16.1067C0.222205 16.2222 0.318201 16.3094 0.436857 16.3368C0.555651 16.3644 0.680212 16.3286 0.766045 16.2421L2.22343 14.7732H2.92602L3.72654 15.5737V16.2763L2.25762 17.7336C2.1711 17.8194 2.13526 17.944 2.16286 18.0628C2.19033 18.1814 2.27754 18.2774 2.39303 18.3163C2.75381 18.438 3.13161 18.4996 3.5156 18.4996C4.66068 18.4996 5.70057 17.966 6.36911 17.0356C6.99548 16.1637 7.18871 15.0952 6.9124 14.0731L8.98434 12.0012L9.45897 12.5168L9.24116 12.7344C9.10382 12.8717 9.10382 13.0944 9.24116 13.2317C9.37849 13.3689 9.60097 13.3689 9.73844 13.2317L9.93565 13.0345L14.3888 17.8715C14.3921 17.8751 14.3956 17.8785 14.399 17.8819C15.223 18.7059 16.558 18.7062 17.3824 17.8818C18.2045 17.0593 18.2045 15.7211 17.3824 14.8986C17.3788 14.895 17.3751 14.8916 17.3714 14.8882L12.5267 10.4436L12.7217 10.2486C12.8591 10.1114 12.8591 9.88882 12.7217 9.75149C12.5844 9.61416 12.3619 9.61416 12.2244 9.75149L12.0081 9.96792L11.4916 9.49386L13.5736 7.41195C13.8696 7.49105 14.175 7.53115 14.4844 7.53115C16.423 7.53115 18 5.95406 18 4.01566C18 3.63155 17.9383 3.2539 17.8167 2.893C17.7778 2.7775 17.6818 2.6903 17.5631 2.66283ZM3.08629 4.08364C3.02037 4.01758 2.93097 3.98394 2.83758 3.98394L2.04242 3.98366L0.794611 1.90038L1.40066 1.29435L3.48044 2.54239V3.33753C3.48044 3.43064 3.51738 3.5199 3.58316 3.58582L8.0009 8.01345L7.50362 8.51058L3.08629 4.08364ZM12.029 10.9413L16.8902 15.4008C17.4332 15.9496 17.4316 16.8381 16.8851 17.3848C16.3374 17.9325 15.4508 17.9341 14.9009 17.3896L10.4332 12.5368L12.029 10.9413ZM11.5105 10.4655L9.95653 12.0191L9.4819 11.5035L10.9939 9.99141L11.5105 10.4655ZM14.4844 6.82803C14.1769 6.82803 13.8745 6.77873 13.5858 6.6815C13.4593 6.63906 13.3195 6.67175 13.2251 6.76609C11.4625 8.52857 7.66471 12.3261 6.26624 13.7247C6.17176 13.8192 6.13894 13.959 6.18165 14.0856C6.47389 14.9534 6.33409 15.879 5.79794 16.6254C5.2633 17.3696 4.43133 17.7965 3.5156 17.7965C3.41273 17.7965 3.31042 17.7909 3.20907 17.78L4.32572 16.6721C4.39219 16.6061 4.42969 16.5163 4.42969 16.4225V15.428C4.42969 15.3348 4.39261 15.2453 4.32669 15.1794L3.32017 14.1729C3.25425 14.107 3.16485 14.0699 3.0716 14.0699H2.07703C1.98323 14.0699 1.89341 14.1074 1.82736 14.1739L0.719489 15.2905C0.708502 15.1892 0.703009 15.0869 0.703009 14.984C0.703009 14.0682 1.12984 13.2364 1.87419 12.7017C2.62046 12.1656 3.54622 12.0257 4.41417 12.318C4.54065 12.3607 4.68046 12.3279 4.77494 12.2334C4.79431 12.2142 11.7288 5.27978 11.7338 5.27483C11.8282 5.18035 11.8609 5.04069 11.8184 4.91407C11.526 4.04629 11.6655 3.12096 12.2012 2.37513C12.7363 1.63025 13.5684 1.20316 14.4843 1.20316C14.5903 1.20316 14.6956 1.20906 14.8 1.2206L13.7065 2.33036C13.6417 2.39614 13.6055 2.48472 13.6055 2.577V3.57154C13.6055 3.66273 13.6408 3.7502 13.7041 3.81571L14.6754 4.8222C14.7416 4.89086 14.833 4.92959 14.9284 4.92959H15.923C16.0166 4.92959 16.1064 4.89223 16.1725 4.82563L17.2804 3.70914C17.2914 3.81049 17.2969 3.9128 17.2969 4.01566C17.2969 5.56638 16.0352 6.82803 14.4844 6.82803Z"
                                    fill="#959499"
                                  />
                                </svg>
                              </div>
                            )}
                            {n?.type === "order_updated" && (
                              <div className="rounded-full bg-success-light w-12 h-12 flex items-center justify-center">
                                <svg
                                  width="20"
                                  height="21"
                                  viewBox="0 0 20 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M10 0.5C4.47719 0.5 0 4.97719 0 10.5C0 16.0231 4.47719 20.5 10 20.5C15.5231 20.5 20 16.0231 20 10.5C20 4.97719 15.5231 0.5 10 0.5ZM10 19.2697C5.17531 19.2697 1.25 15.3247 1.25 10.5C1.25 5.67527 5.17531 1.74996 10 1.74996C14.8247 1.74996 18.75 5.67529 18.75 10.5C18.75 15.3246 14.8247 19.2697 10 19.2697ZM13.9909 6.84094L8.12373 12.745L5.48154 10.1028C5.23748 9.85875 4.84186 9.85875 4.59748 10.1028C4.35342 10.3469 4.35342 10.7425 4.59748 10.9866L7.69092 14.0803C7.93498 14.3241 8.33061 14.3241 8.57498 14.0803C8.60311 14.0522 8.62719 14.0215 8.64906 13.9897L14.8753 7.72498C15.1191 7.48092 15.1191 7.08529 14.8753 6.84094C14.6309 6.59688 14.2353 6.59688 13.9909 6.84094Z"
                                    fill="#58B984"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-semibold text-gray-100">
                              {String(n?.title || "")}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {String(n?.message || "")}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {formatDate(String(n?.created_at || ""), locale)}
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {!onlyNotifications && (
          <div className="relative" ref={menuRef}>
            <button
              className={`flex gap-2 items-center self-stretch p-2 my-auto w-11 h-11 rounded border border-solid cursor-pointer ${
                isProfileMenuOpen
                  ? "bg-white border-transparent"
                  : "border-neutral-400"
              }`}
              aria-haspopup="menu"
              aria-expanded={isProfileMenuOpen}
              aria-label={t("profile")}
              onClick={() => {
                setIsProfileMenuOpen((v) => !v);
                setIsNotificationsOpen(false);
              }}
            >
              <UserIcon
                className={isProfileMenuOpen ? "text-background" : "text-white"}
              />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-md bg-white text-background shadow-lg z-50 overflow-hidden">
                <Link
                  href={`${localePrefix}/profile`}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-10 cursor-pointer"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  {t("profile")}
                </Link>
                <button
                  onClick={() => {
                    setShowLogoutModal(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-10 cursor-pointer"
                  disabled={isLoadingLogout || !getAuth()}
                >
                  {t("logOut")}
                </button>
              </div>
            )}
          </div>
        )}

        {!onlyNotifications && (
          <Link
            href={`${localePrefix}/requests#active`}
            className="w-full flex py-3 px-6 justify-center items-center gap-2 rounded-lg relative cursor-pointer border border-solid border-transparent bg-button-secondary-bg hover:opacity-90 transition-opacity"
          >
            <div className="text-button-primary-text text-center relative text-base font-bold">
              {t("myRequests")}
            </div>
          </Link>
        )}
      </nav>
      {mounted &&
        showLogoutModal &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/25 px-4">
            <div className="w-full max-w-[520px] bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-100 mb-4 text-center">
                {t("logoutMessage")}
              </h2>
              <div className="flex justify-center gap-3">
                <button
                  onClick={onLogout}
                  className="px-5 py-2.5 rounded-lg bg-button-primary-bg text-black hover:bg-button-primary-bg/90 focus:outline-none focus:ring-2 focus:ring-button-primary-bg cursor-pointer"
                  disabled={isLoadingLogout}
                >
                  {t("logOut")}
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#dadade] text-gray-100 hover:bg-gray-10 cursor-pointer"
                  disabled={isLoadingLogout}
                >
                  {t("refuse")}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
