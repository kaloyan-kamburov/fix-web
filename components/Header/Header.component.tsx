"use client";
import * as React from "react";
import Link from "next/link";
import { BellIcon } from "lucide-react";
import { Logo } from "../Logo/Logo.component";
import HeaderActions from "./HeaderActions/HeaderActions.component";
import { NotificationsProvider } from "./NotificationsProvider";
import Image from "next/image";
import { getAuth, onAuthChanged } from "@/lib/auth";
import { useRouter, usePathname, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { clearAuth } from "@/lib/auth";
import { useTranslations } from "next-intl";
import CountryLanguageSelector from "../CountryLangaugeSelector/CountryLangaugeSelector";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isLocaleSelectorOpen, setIsLocaleSelectorOpen] = React.useState(false);
  const router = useRouter();
  const t = useTranslations();
  const pathname = usePathname();
  const { locale } = useParams();
  const [currentLang, currentCountry] = String(locale || "bg-bg").split("-");
  const countryCodeLower = (currentCountry || "bg").toLowerCase();
  const countryFlagUrl = `https://kmp-admin.perspectiveunity.com/flags/${countryCodeLower}.png`;

  const isCategoriesActive = React.useMemo(
    () =>
      pathname.startsWith(`/${locale}/categories`) &&
      !pathname.includes("emergencies"),
    [pathname, locale]
  );

  const loginHref = React.useMemo(() => `/${locale}/login`, [locale]);

  const isEmergenciesActive = React.useMemo(
    () => pathname.includes("emergencies"),
    [pathname, locale]
  );

  React.useEffect(() => {
    // Initialize from client storage to avoid SSR/client mismatch
    setIsLoggedIn(!!getAuth());
    const unsubscribe = onAuthChanged(() => {
      setIsLoggedIn(!!getAuth());
    });
    return unsubscribe;
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      // Compute tenant id for header reliability
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
      const parts = window.location.pathname.split("/").filter(Boolean);
      const firstSeg = parts[0] || String(locale || "bg-bg");
      const appLang = (firstSeg.split("-")[0] || "bg").toLowerCase();
      await api.post(
        "logout",
        {},
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            ...(tenantId ? { "X-Tenant-ID": String(tenantId) } : {}),
            "app-locale": appLang,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (_) {
      // handled globally by interceptor; proceed to clear locally
    } finally {
      clearAuth();
      closeMobileMenu();
      router.push(`/${locale}`);
    }
  };

  // Initialize tenant mapping and cookie based on current URL country
  React.useEffect(() => {
    let active = true;
    const ensureTenant = async () => {
      try {
        const cookies = document.cookie.split(";").map((c) => c.trim());
        const hasTenant = cookies.some((c) => c.startsWith("tenant_id="));
        if (hasTenant) return;
        const mapRaw = localStorage.getItem("COUNTRY_CODE_TO_ID");
        let codeToId: Record<string, number> | null = null;
        if (mapRaw) {
          codeToId = JSON.parse(mapRaw);
        } else {
          // Lazy fetch mapping if not cached
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/countries`,
            { cache: "no-store" }
          );
          const data = await res.json();
          const arr = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
            ? data.data
            : [];
          const map: Record<string, number> = {};
          for (const it of arr) {
            const code = String(it?.code || "").toUpperCase();
            const id = Number(it?.id || 0);
            if (code && id) map[code] = id;
          }
          if (!active) return;
          localStorage.setItem("COUNTRY_CODE_TO_ID", JSON.stringify(map));
          codeToId = map;
        }
        const cc = (currentCountry || "bg").toUpperCase();
        const id = codeToId?.[cc];
        if (id) {
          // Set cookie for SSR requests as well
          document.cookie = `tenant_id=${id}; Path=/; SameSite=Lax; Max-Age=${
            60 * 60 * 24 * 365
          }`;
          localStorage.setItem("preferred_country_id", String(id));
        }
      } catch {}
    };
    ensureTenant();
    return () => {
      active = false;
    };
  }, [currentCountry]);

  return (
    <NotificationsProvider isEnabled={isLoggedIn}>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex w-full px-16 py-[16px] md:py-5 flex-col justify-center items-center md:px-8 px-[16px] sm:h-auto transition-all duration-300 lg:transparent bg-[#1C1C1D]/95 will-change-transform transform-gpu`}
      >
        <div className="flex justify-between items-center w-full relative sm:justify-between">
          <div>
            <Link href={`/${locale}`}>
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on screens < 1024px */}
          <div className="hidden lg:flex justify-center items-center gap-6 relative">
            <Link
              href={`/${locale}/categories`}
              className="flex justify-center items-center gap-1 relative"
            >
              <div
                className={`text-center relative text-lg font-normal cursor-pointer transition-colors ${
                  isCategoriesActive
                    ? "text-accentaccent"
                    : "text-gray-00 hover:text-accentaccent"
                }`}
              >
                {t("serviceSearch")}
              </div>
            </Link>
            <Link
              href={`/${locale}/emergencies`}
              className="flex justify-center items-center gap-1 relative"
            >
              <div
                className={`text-center relative text-lg font-normal cursor-pointer transition-colors ${
                  isEmergenciesActive
                    ? "text-accentaccent"
                    : "text-gray-00 hover:text-accentaccent"
                }`}
              >
                {t("emergencySituations")}
              </div>
            </Link>

            {!isLoggedIn && (
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center justify-center gap-2 px-2 h-11 rounded border border-solid border-neutral-400 text-gray-00"
                  onClick={() => setIsLocaleSelectorOpen(true)}
                  aria-label={t("chooseLanguage")}
                >
                  <Image
                    src={countryFlagUrl}
                    alt={currentCountry || "country"}
                    width={24}
                    height={18}
                  />
                  {currentCountry?.toUpperCase()}
                </button>
              </div>
            )}
            {isLoggedIn ? (
              <HeaderActions
                onNotificationsOpen={() => setIsMobileMenuOpen(false)}
              />
            ) : (
              <Link
                href={loginHref}
                className="flex py-3 px-6 justify-center items-center gap-2 rounded-lg relative cursor-pointer border-none bg-button-primary-bg hover:opacity-90 transition-opacity"
              >
                <div className="text-button-primary-text text-center relative text-base font-bold">
                  {t("login")}
                </div>
              </Link>
            )}
          </div>

          {/* Mobile actions: notifications + hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex items-center gap-2">
              <button
                className="flex items-center justify-center w-11 h-11 rounded border border-solid border-neutral-400 text-gray-00"
                onClick={() => setIsLocaleSelectorOpen(true)}
                aria-label={t("chooseLanguage")}
              >
                <Image
                  src={countryFlagUrl}
                  alt={currentCountry || "country"}
                  width={24}
                  height={18}
                />
              </button>
            </div>
            {isLoggedIn ? (
              <HeaderActions
                onlyNotifications
                onNotificationsOpen={() => setIsMobileMenuOpen(false)}
              />
            ) : (
              <button
                className="flex items-center justify-center w-11 h-11 rounded border border-solid border-neutral-400 text-gray-00"
                aria-label={t("notifications")}
              >
                <BellIcon className="text-white" />
              </button>
            )}
            <div
              className="text-gray-00 text-2xl cursor-pointer w-[35px] h-[35px] flex items-center justify-center"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <svg
                  width="35"
                  height="35"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#FFF5AC"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              ) : (
                <svg
                  width="30"
                  height="28"
                  viewBox="0 0 30 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M28.3333 24C28.7581 24.0005 29.1667 24.1631 29.4756 24.4547C29.7845 24.7464 29.9704 25.1449 29.9953 25.569C30.0202 25.9931 29.8822 26.4106 29.6096 26.7364C29.3369 27.0621 28.9502 27.2715 28.5283 27.3217L28.3333 27.3333H1.66667C1.24187 27.3329 0.83328 27.1702 0.524386 26.8786C0.215493 26.587 0.0296083 26.1884 0.00471314 25.7643C-0.0201821 25.3403 0.117791 24.9227 0.390441 24.5969C0.663092 24.2712 1.04984 24.0618 1.47167 24.0117L1.66667 24H28.3333ZM28.3333 12.3333C28.7754 12.3333 29.1993 12.5089 29.5118 12.8215C29.8244 13.134 30 13.558 30 14C30 14.442 29.8244 14.8659 29.5118 15.1785C29.1993 15.4911 28.7754 15.6667 28.3333 15.6667H1.66667C1.22464 15.6667 0.800716 15.4911 0.488155 15.1785C0.175595 14.8659 0 14.442 0 14C0 13.558 0.175595 13.134 0.488155 12.8215C0.800716 12.5089 1.22464 12.3333 1.66667 12.3333H28.3333ZM28.3333 0.666664C28.7754 0.666664 29.1993 0.842259 29.5118 1.15482C29.8244 1.46738 30 1.8913 30 2.33333C30 2.77536 29.8244 3.19928 29.5118 3.51184C29.1993 3.8244 28.7754 4 28.3333 4H1.66667C1.22464 4 0.800716 3.8244 0.488155 3.51184C0.175595 3.19928 0 2.77536 0 2.33333C0 1.8913 0.175595 1.46738 0.488155 1.15482C0.800716 0.842259 1.22464 0.666664 1.66667 0.666664H28.3333Z"
                    fill="#FFF5AC"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className={`absolute top-full left-0 w-full bg-[#1C1C1D]/95 border-t border-[#333] shadow-lg z-50 lg:hidden`}
          >
            <div className={`px-5 py-4 flex flex-col`}>
              <Link
                href={`/${locale}/categories`}
                className="text-gray-00 text-lg font-normal cursor-pointer hover:text-[#F1E180] transition-colors py-2"
                onClick={closeMobileMenu}
              >
                {t("serviceSearch")}
              </Link>
              <Link
                href={`/${locale}/emergencies`}
                className="text-gray-00 text-lg font-normal cursor-pointer hover:text-[#F1E180] transition-colors py-2"
                onClick={closeMobileMenu}
              >
                {t("emergencySituations")}
              </Link>
              <div className="flex items-center gap-3"></div>
              <div className="pt-4 space-y-3">
                {isLoggedIn ? (
                  <>
                    <Link
                      href={`/${locale}/requests#active`}
                      onClick={closeMobileMenu}
                      className="w-full flex py-3 px-6 justify-center items-center gap-2 rounded-lg relative cursor-pointer border border-solid border-transparent bg-button-secondary-bg hover:opacity-90 transition-opacity"
                    >
                      <div className="text-button-primary-text text-center relative text-base font-bold">
                        {t("myRequests")}
                      </div>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex py-3 px-6 justify-center items-center gap-2 rounded-lg border border-solid border-neutral-400 text-gray-00"
                    >
                      {t("logOut")}
                    </button>
                  </>
                ) : (
                  <Link
                    href={loginHref}
                    onClick={closeMobileMenu}
                    className="w-full flex py-3 px-6 justify-center items-center gap-2 rounded-lg relative cursor-pointer border-none bg-button-primary-bg hover:opacity-90 transition-opacity"
                  >
                    <div className="text-button-primary-text text-center relative text-base font-bold">
                      {t("login")}
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      {!isLoggedIn && (
        <CountryLanguageSelector
          open={isLocaleSelectorOpen}
          onClose={() => setIsLocaleSelectorOpen(false)}
        />
      )}
    </NotificationsProvider>
  );
}
