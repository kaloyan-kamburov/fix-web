"use client";

import * as React from "react";
import { NextIntlClientProvider } from "next-intl";

const legacyMap: Record<string, string> = {
  bg: "bg.i18n.json",
  en: "en.i18n.json",
};

const supported = new Set<string>(Object.keys(legacyMap));

export default function I18nClientBridge({
  country,
  children,
}: {
  country: string;
  children: React.ReactNode;
}) {
  const [overrideMessages, setOverrideMessages] = React.useState<Record<
    string,
    unknown
  > | null>(null);
  const [loadedLang, setLoadedLang] = React.useState<string | null>(null);

  const loadMessages = React.useCallback(async () => {
    try {
      const ls =
        typeof window !== "undefined"
          ? localStorage.getItem("NEXT_LOCALE")
          : null;
      const nextLang = (ls || "").toLowerCase();
      if (!supported.has(nextLang)) {
        setOverrideMessages(null);
        setLoadedLang(null);
        return;
      }
      const legacy = legacyMap[nextLang] || `${nextLang}.json`;
      const res = await fetch(`/i18n/${legacy}`, { cache: "force-cache" });
      if (!res.ok) return;
      const data = (await res.json()) as Record<string, unknown>;
      setOverrideMessages(data);
      setLoadedLang(nextLang);
    } catch {}
  }, []);

  React.useEffect(() => {
    (async () => {
      await loadMessages();
    })();
  }, [loadMessages]);

  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "NEXT_LOCALE") return;
      loadMessages();
    };
    const onLocaleChanged = () => {
      loadMessages();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("locale-changed", onLocaleChanged as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        "locale-changed",
        onLocaleChanged as EventListener
      );
    };
  }, [loadMessages]);

  if (overrideMessages && loadedLang) {
    return (
      <NextIntlClientProvider
        key={`${country}-${loadedLang}-override`}
        messages={overrideMessages}
        locale={country}
      >
        {children}
      </NextIntlClientProvider>
    );
  }

  return <>{children}</>;
}
