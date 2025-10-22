"use client";
import * as React from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import Image from "next/image";
import { api } from "@/lib/api";
import Loader from "@/components/Loader/Loader";
import Link from "next/link";

type RawService = any;

type ServiceItem = {
  id: string;
  name: string;
  description: string;
  picture: string;
  pricePrimary: string | null;
  priceSecondary: string | null;
  slug: string;
};

function normalizeServices(raw: unknown): ServiceItem[] {
  const root: any = raw;
  const arr: any[] = Array.isArray(root)
    ? root
    : Array.isArray(root?.data)
    ? root.data
    : [];
  return arr.map((s: RawService) => {
    const id = String(s?.id ?? "");
    const name = String(s?.name ?? "");
    const description = String(s?.description ?? "");
    const picture = String(s?.picture ?? "");
    const currency = String(s?.currency?.symbol || s?.currency?.code || "");
    const currency2 = String(
      s?.second_currency?.symbol || s?.second_currency?.code || ""
    );
    const useFixed = !!s?.use_fixed_price;
    const priceFrom = s?.price_from != null ? String(s.price_from) : null;
    const priceTo = s?.price_to != null ? String(s.price_to) : null;
    const fixedPrice = s?.fixed_price != null ? String(s.fixed_price) : null;
    const priceFrom2 =
      s?.price_from_second != null ? String(s.price_from_second) : null;
    const priceTo2 =
      s?.price_to_second != null ? String(s.price_to_second) : null;
    const fixed2 =
      s?.fixed_price_second != null ? String(s.fixed_price_second) : null;
    const slug = String(s?.slug ?? "");
    const primary = useFixed
      ? fixedPrice
      : priceFrom && priceTo
      ? `${priceFrom} - ${priceTo}`
      : priceFrom || priceTo || null;
    const secondary = useFixed
      ? fixed2
      : priceFrom2 && priceTo2
      ? `${priceFrom2} - ${priceTo2}`
      : priceFrom2 || priceTo2 || null;

    const pricePrimary = primary ? `${primary} ${currency}` : null;
    const priceSecondary = secondary ? `${secondary} ${currency2}` : null;

    return {
      id,
      name,
      description,
      picture,
      pricePrimary,
      priceSecondary,
      slug,
    };
  });
}

export default function ServicesSearch({
  initialData,
  locale,
  categoryId,
  isUrgent,
}: {
  initialData: unknown;
  locale: string;
  categoryId?: string;
  isUrgent?: boolean;
}) {
  const t = useTranslations();
  const lang = React.useMemo(() => (locale || "bg").split("-")[0], [locale]);
  const [query, setQuery] = React.useState("");
  const [items, setItems] = React.useState<ServiceItem[]>(() =>
    normalizeServices(initialData)
  );
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();
    const q = query.trim();
    if (!q) {
      setItems(normalizeServices(initialData));
      return () => controller.abort();
    }
    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await api.get("services", {
          params: {
            "filter[name]": q,
            ...(isUrgent ? { "filter[is_urgent]": isUrgent } : {}),
          },
          signal: controller.signal as any,
          // app-locale handled by interceptor
        });
        setItems(normalizeServices(res.data));
      } catch (_) {
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, initialData, lang, isUrgent]);

  return (
    <>
      {/* Search bar */}
      <section className="box-border flex relative flex-col gap-2 items-center justify-center py-4 w-full bg-gray-10 max-w-[1440px] mx-auto px-4">
        <div className="w-full max-w-[960px] ">
          <div className="box-border flex relative items-center px-3 py-3 rounded-xl border border-solid bg-stone-50 border-zinc-200">
            <Search className="w-5 h-5 text-zinc-500 mr-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchServices")}
              className="w-full bg-transparent outline-none text-base text-zinc-900 placeholder:text-zinc-500 pl-1"
              aria-label="Search services"
            />
          </div>
        </div>
      </section>

      {/* Results */}
      <div className="flex flex-col gap-3 items-center w-full max-w-[960px] mx-auto">
        {items.map((it) => (
          <Link
            href={`/${locale}/categories/${categoryId}/${it.slug}`}
            key={it.id}
            className="flex flex-wrap gap-3 items-center self-stretch p-3 text-base rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors"
          >
            <Image
              src={it.picture}
              alt={it.name}
              width={112}
              height={112}
              className="object-contain shrink-0 self-stretch my-auto w-28 h-28 rounded-lg"
            />
            <div className="flex flex-col flex-1 shrink justify-center self-stretch my-auto basis-0 min-w-60 text-left">
              <h6 className="text-2xl max-md:text-[14px] text-neutral-700">
                {it.name}
              </h6>
              <p className="mt-2 text-zinc-500 max-md:max-w-full font-normal max-md:text-[14px]">
                {it.description}
              </p>
              <div className="self-start mt-2 text-center text-zinc-900 max-md:text-[14px]">
                {it.pricePrimary}
                {it.priceSecondary ? ` (${it.priceSecondary})` : ""}
              </div>
            </div>
          </Link>
        ))}
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <Loader />
          </div>
        )}
      </div>
    </>
  );
}
