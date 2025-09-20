import { NextIntlClientProvider } from "next-intl";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import fs from "node:fs/promises";
import path from "node:path";

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
  const { locale: incomingLocale } = await params;
  const locale = supportedLocales.has(incomingLocale) ? incomingLocale : "bg";
  const baseDir = path.join(process.cwd(), "public", "i18n");
  let messages: Record<string, unknown> = {};
  try {
    const data = await fs.readFile(
      path.join(baseDir, `${locale}.json`),
      "utf8"
    );
    messages = JSON.parse(data);
  } catch {
    const legacy = legacyMap[locale];
    if (legacy) {
      try {
        const data = await fs.readFile(path.join(baseDir, legacy), "utf8");
        messages = JSON.parse(data);
      } catch {}
    }
  }

  return (
    <NextIntlClientProvider key={locale} messages={messages} locale={locale}>
      {children}
      <Toaster position="bottom-right" />
    </NextIntlClientProvider>
  );
}
