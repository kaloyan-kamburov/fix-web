import { NextIntlClientProvider } from "next-intl";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import fs from "node:fs/promises";
import path from "node:path";
import Header from "@/components/Header/Header.component";
import { SiteFooterSection } from "@/components/sections/SiteFooterSection";

const legacyMap: Record<string, string> = {
  bg: "bg.i18n.json",
  en: "en.i18n.json",
};

const supportedLocales = new Set<string>(Object.keys(legacyMap));

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: incoming } = await params; // now expects lang-country
  const [langRaw] = (incoming || "").split("-");
  const lang = supportedLocales.has(langRaw) ? langRaw : "bg";
  const baseDir = path.join(process.cwd(), "public", "i18n");
  let messages: Record<string, unknown> = {};
  try {
    const data = await fs.readFile(path.join(baseDir, `${lang}.json`), "utf8");
    messages = JSON.parse(data);
  } catch {
    const legacy = legacyMap[lang];
    if (legacy) {
      try {
        const data = await fs.readFile(path.join(baseDir, legacy), "utf8");
        messages = JSON.parse(data);
      } catch {}
    }
  }

  return (
    <NextIntlClientProvider key={lang} messages={messages} locale={lang}>
      {/* Header (client) */}
      <Header />
      {/* Page content */}
      <main>{children}</main>
      {/* Footer (client) */}
      <SiteFooterSection />
      <Toaster position="bottom-right" />
    </NextIntlClientProvider>
  );
}
