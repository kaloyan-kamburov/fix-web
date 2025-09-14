import { getRequestConfig } from "next-intl/server";
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
};

export default getRequestConfig(async ({ locale }) => {
  const baseDir = path.join(process.cwd(), "public", "i18n");
  const currentLocale = (locale as string) || "bg";
  let messages: Record<string, unknown> = {};
  try {
    const data = await fs.readFile(
      path.join(baseDir, `${currentLocale}.json`),
      "utf8"
    );
    messages = JSON.parse(data);
    return { locale: currentLocale, messages };
  } catch {}
  try {
    const legacyFile = legacyMap[currentLocale];
    if (legacyFile) {
      const legacyData = await fs.readFile(
        path.join(baseDir, legacyFile),
        "utf8"
      );
      messages = JSON.parse(legacyData);
    }
  } catch {}
  return { locale: currentLocale, messages };
});
