import { getRequestConfig } from "next-intl/server";
import fs from "node:fs/promises";
import path from "node:path";

const legacyMap: Record<string, string> = {
  bg: "bg.i18n.json",
  en: "en.i18n.json",
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
