"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { BellIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { clearAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { useTranslations } from "next-intl";
export default function HeaderActions() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const [isLoadingLogout, setIsLoadingLogout] = React.useState(false);
  const t = useTranslations();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const LOCALES = React.useMemo(
    () =>
      new Set([
        "bg",
        "en",
        "fr",
        "de",
        "it",
        "es",
        "tr",
        "gr",
        "nl",
        "swe",
        "por",
        "cr",
        "est",
        "fin",
        "irl",
        "lat",
        "lit",
        "lux",
        "mal",
        "slovakian",
        "slovenian",
      ]),
    []
  );

  const localePrefix = React.useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    const maybeLocale = parts[0];
    return LOCALES.has(maybeLocale) ? `/${maybeLocale}` : "";
  }, [pathname, LOCALES]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
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
      await api.post("client/logout");
    } catch (e) {
      // ignore, interceptor will handle toast; we'll still clear locally
    } finally {
      clearAuth();
      setIsMenuOpen(false);
      // Preserve locale in URL if present
      const parts = pathname.split("/").filter(Boolean);
      const maybeLocale = parts[0];
      const locales = new Set([
        "bg",
        "en",
        "fr",
        "de",
        "it",
        "es",
        "tr",
        "gr",
        "nl",
        "swe",
        "por",
        "cr",
        "est",
        "fin",
        "irl",
        "lat",
        "lit",
        "lux",
        "mal",
        "slovakian",
        "slovenian",
      ]);
      const target = locales.has(maybeLocale) ? `/${maybeLocale}` : "/";
      router.push(target);
      setIsLoadingLogout(false);
    }
  };

  return (
    <>
      <nav className="flex gap-3 items-center">
        <button
          className={`flex gap-2 items-center self-stretch p-2 my-auto w-11 h-11 rounded border border-solid border-neutral-400 cursor-pointer`}
          aria-label="Нотификации"
        >
          <BellIcon className="text-white" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            className={`flex gap-2 items-center self-stretch p-2 my-auto w-11 h-11 rounded border border-solid cursor-pointer ${
              isMenuOpen ? "bg-white border-transparent" : "border-neutral-400"
            }`}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            aria-label="Потребителски профил"
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            <UserIcon
              className={isMenuOpen ? "text-background" : "text-white"}
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-md border border-[#dadade] bg-white text-background shadow-lg z-50 overflow-hidden">
              <Link
                href={`${localePrefix}/profile`}
                className="block w-full text-left px-4 py-2 hover:bg-gray-10 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("profile")}
              </Link>
              <button
                onClick={() => {
                  setShowLogoutModal(true);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-10 cursor-pointer"
                disabled={isLoadingLogout}
              >
                {t("logOut")}
              </button>
            </div>
          )}
        </div>

        <Link
          href={`${localePrefix}/orders`}
          className="w-full flex py-3 px-6 justify-center items-center gap-2 rounded-lg relative cursor-pointer border border-solid border-transparent bg-button-secondary-bg hover:opacity-90 transition-opacity"
        >
          <div className="text-button-primary-text text-center relative text-base font-bold">
            {t("myRequests")}
          </div>
        </Link>
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
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#dadade] text-gray-100 hover:bg-gray-10 cursor-pointer"
                  disabled={isLoadingLogout}
                >
                  {t("refuse")}
                </button>
                <button
                  onClick={onLogout}
                  className="px-5 py-2.5 rounded-lg bg-button-primary-bg text-black hover:bg-button-primary-bg/90 focus:outline-none focus:ring-2 focus:ring-button-primary-bg cursor-pointer"
                  disabled={isLoadingLogout}
                >
                  {t("logOut")}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
