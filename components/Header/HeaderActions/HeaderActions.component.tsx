"use client";

import * as React from "react";
import { BellIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearAuth } from "@/lib/auth";
import { api } from "@/lib/api";
export default function HeaderActions() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const [isLoadingLogout, setIsLoadingLogout] = React.useState(false);

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
      await api.post("logout");
    } catch (e) {
      // ignore, interceptor will handle toast; we'll still clear locally
    } finally {
      clearAuth();
      setIsMenuOpen(false);
      router.push("/");
      setIsLoadingLogout(false);
    }
  };

  return (
    <nav className="flex gap-3 items-center">
      <button
        className={`flex gap-2 items-center self-stretch p-2 my-auto w-11 h-11 rounded border border-solid border-neutral-400 cursor-pointer`}
        aria-label="Нотификации"
      >
        <BellIcon />
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
          <UserIcon className={isMenuOpen ? "text-background" : "text-white"} />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-40 rounded-md border border-[#dadade] bg-white text-background shadow-lg z-50">
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-10 cursor-pointer"
              disabled={isLoadingLogout}
            >
              {isLoadingLogout ? "Изчакайте..." : "Изход"}
            </button>
          </div>
        )}
      </div>

      <Link
        href="/login"
        className="w-full flex py-3 px-6 justify-center items-center gap-2 rounded-lg relative cursor-pointer border border-solid border-transparent bg-button-secondary-bg hover:opacity-90 transition-opacity"
      >
        <div className="text-button-primary-text text-center relative text-base font-bold">
          Моите заявки
        </div>
      </Link>
    </nav>
  );
}
