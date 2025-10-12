import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import "../../globals.css";
import { Toaster } from "react-hot-toast";
import fs from "node:fs/promises";
import path from "node:path";
import Header from "@/components/Header/Header.component";
import { SiteFooterSection } from "@/components/sections/SiteFooterSection";
import CanonicalLink from "@/components/SEO/CanonicalLink";
import JsonLd from "@/components/SEO/JsonLd";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: incomingLocale } = await params;
  const lang = (incomingLocale || "bg").split("-")[0].toLowerCase();
  const baseDir = path.join(process.cwd(), "public", "i18n");
  let messages: Record<string, unknown> = {};
  const candidates = [
    path.join(baseDir, `${lang}.i18n.json`),
    path.join(baseDir, `${lang}.json`),
    path.join(baseDir, `en.i18n.json`),
  ];
  for (const p of candidates) {
    try {
      const data = await fs.readFile(p, "utf8");
      messages = JSON.parse(data);
      break;
    } catch {}
  }

  return (
    <NextIntlClientProvider key={lang} messages={messages} locale={lang}>
      {/* Skip canonical here if checkout is considered private; otherwise include */}
      <CanonicalLink
        excludePrefixes={[
          "/" + (await params).locale + "/checkout",
          "/" + (await params).locale + "/login",
          "/" + (await params).locale + "/register",
          "/" + (await params).locale + "/profile",
        ]}
      />
      <JsonLd
        excludePrefixes={[
          "/" + (await params).locale + "/checkout",
          "/" + (await params).locale + "/login",
          "/" + (await params).locale + "/register",
          "/" + (await params).locale + "/profile",
        ]}
      />
      {/* Header (client) */}
      <Header />
      {/* Page content */}
      <main className="flex-1 flex flex-col items-start justify-center px-[16px] md:px-4 py-8 bg-gray-10 w-full max-w-[1440px] mx-auto">
        {children}
      </main>
      {/* Footer (client) */}
      <SiteFooterSection />
      <Toaster position="bottom-right" />
    </NextIntlClientProvider>
  );
}

export const metadata: Metadata = {
  title: {
    template: "FIX | %s",
    default: "FIX",
  },
  robots: {
    index: false,
    follow: false,
  },
};
