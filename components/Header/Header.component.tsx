"use client";
import * as React from "react";
import Link from "next/link";
import { BellIcon } from "lucide-react";
import { Logo } from "../Logo/Logo.component";
import HeaderActions from "./HeaderActions/HeaderActions.component";
import { NotificationsProvider } from "./NotificationsProvider";
import LanguageSelector from "./LanguageSelector";
import CountrySelector from "./CountrySelector";
import { getAuth, onAuthChanged } from "@/lib/auth";
import { useRouter, usePathname, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { clearAuth } from "@/lib/auth";
import { useTranslations } from "next-intl";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const router = useRouter();
  const t = useTranslations();
  const pathname = usePathname();
  const { locale } = useParams();

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
      await api.post("logout");
    } catch (_) {
      // handled globally by interceptor; proceed to clear locally
    } finally {
      clearAuth();
      closeMobileMenu();
      router.push(`/${locale}`);
    }
  };

  return (
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
          <div className="flex items-center gap-3">
            <CountrySelector />
            <LanguageSelector />
          </div>
          {isLoggedIn ? (
            <NotificationsProvider isEnabled={true}>
              <HeaderActions
                onNotificationsOpen={() => setIsMobileMenuOpen(false)}
              />
            </NotificationsProvider>
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
            <CountrySelector />
            <LanguageSelector />
          </div>
          {isLoggedIn ? (
            <NotificationsProvider isEnabled={true}>
              <HeaderActions
                onlyNotifications
                onNotificationsOpen={() => setIsMobileMenuOpen(false)}
              />
            </NotificationsProvider>
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
  );
}
