import { NextIntlClientProvider } from "next-intl";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import fs from "node:fs/promises";
import path from "node:path";

const legacyMap: Record<string, string> = {
  bg: "strings_bg.i18n.json",
  en: "strings_en.i18n.json",
  tr: "strings_tr.i18n.json",
  gr: "strings_gr.i18n.json",
  nl: "strings_nl.i18n.json",
  swe: "strings_swe.i18n.json",
  por: "strings_por.i18n.json",
  cr: "strings_cr.i18n.json",
  est: "strings_est.i18n.json",
  fin: "strings_fin.i18n.json",
  irl: "strings_irl.i18n.json",
  lat: "strings_lat.i18n.json",
  lit: "strings_lit.i18n.json",
  lux: "strings_lux.i18n.json",
  mal: "strings_mal.i18n.json",
  slovakian: "strings_slovakian.i18n.json",
  slovenian: "strings_slovenian.i18n.json",
  fr: "strings_fr.i18n.json",
  de: "strings_de.i18n.json",
  it: "strings_it.i18n.json",
  es: "strings_es.i18n.json",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: incomingLocale } = await params;
  const locale = incomingLocale || "bg";
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
