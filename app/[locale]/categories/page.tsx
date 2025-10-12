import { getTranslations } from "next-intl/server";
import { api } from "@/lib/api";
import Image from "next/image";
import CategoriesCTA from "@/components/Categories/CategoriesCTA";
import CategoriesList from "@/components/Categories/CategoriesList";
import type { Metadata } from "next";

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  let data: unknown = null;
  let items: Array<{
    id: number;
    name: string;
    picture: string;
    price: string | null;
    currency: string;
    secondPrice: string | null;
    secondCurrency: string;
  }> = [];
  try {
    const res = await api.get("categories");
    data = res.data;
    const root: any = data;
    const arr: any[] = Array.isArray(root)
      ? root
      : Array.isArray(root?.data)
      ? root.data
      : [];
    items = arr.map((c: any) => {
      const id = Number(c?.id ?? 0) || 0;
      const name = String(c?.name ?? "");
      const picture = String(c?.picture ?? "");
      const price = c?.price != null ? String(c.price) : null;
      const currency = String(c?.currency?.symbol || c?.currency?.code || "");
      const secondPrice =
        c?.price_second != null ? String(c.price_second) : null;
      const secondCurrency = String(
        c?.second_currency?.symbol || c?.second_currency?.code || ""
      );
      const slug = String(c?.slug ?? "");
      return {
        id,
        name,
        slug,
        picture,
        price,
        currency,
        secondPrice,
        secondCurrency,
      };
    });
  } catch (_) {
    data = { error: true };
  }

  return (
    <section className="flex flex-col justify-center pb-10 text-base font-semibold text-center bg-gray-10 text-zinc-900 pt-[130px] max-md:pt-[76px]">
      <CategoriesList items={items} />
      <CategoriesCTA />
    </section>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = (locale || "bg").split("-")[0];
  try {
    const t = await getTranslations({ locale: lang });
    return {
      // Layout template will prefix with "FIX |"; if this is empty, layout default "FIX" will be used
      title: t("categories"),
      description: t("serviceCategoriesTitle"),
    };
  } catch {
    return {
      // Let layout default to just "FIX"
      title: undefined,
      description: undefined,
    };
  }
}
