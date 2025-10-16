import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = (locale || "bg").split("-")[0];
  const t = await getTranslations({ locale: lang });
  return {
    title: `FIX | ${t("receivedOffer")}`,
    openGraph: {
      title: `FIX | ${t("receivedOffer")}`,
      type: "article",
      locale: lang,
    },
  };
}
