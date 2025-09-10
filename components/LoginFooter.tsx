import React from "react";
import { cn } from "@/lib/utils";

interface LoginFooterProps {
  className?: string;
}

export function LoginFooter({ className }: LoginFooterProps) {
  return (
    <footer
      className={cn(
        "flex relative flex-col gap-8 items-center self-stretch pb-10 w-full bg-zinc-900 max-sm:gap-5 max-sm:pb-6",
        className
      )}
    >
      <div className="relative w-full h-px bg-white max-w-[1440px]" />
      <div className="flex relative flex-wrap gap-6 justify-center items-start max-md:flex-col max-md:gap-4 max-md:items-center max-sm:gap-3">
        <p className="relative text-sm text-stone-50">
          © 2025 All rights reserved.
        </p>
        <nav className="flex relative flex-wrap gap-6 items-start">
          <a
            href="#"
            className="relative text-sm text-stone-50 hover:text-gray-300 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="relative text-sm text-stone-50 hover:text-gray-300 transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="relative text-sm text-stone-50 hover:text-gray-300 transition-colors"
          >
            Cookies Settings
          </a>
        </nav>
      </div>
    </footer>
  );
}
