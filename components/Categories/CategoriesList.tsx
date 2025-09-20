"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

export type CategoryItem = {
  id: number;
  name: string;
  picture?: string;
  price?: string | null;
  currency?: string;
  secondPrice?: string | null;
  secondCurrency?: string;
};

export default function CategoriesList({ items }: { items: CategoryItem[] }) {
  const t = useTranslations();
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => (it.name || "").toLowerCase().includes(q));
  }, [items, query]);

  return (
    <>
      {/* Search bar */}
      <section className="box-border flex relative flex-col gap-2 items-center justify-center py-8 w-full bg-zinc-100 max-w-[1440px] mx-auto px-4">
        <div className="w-full max-w-[960px] ">
          <div className="box-border flex relative items-center px-3 py-3 rounded-xl border border-solid bg-stone-50 border-zinc-200">
            <Search className="w-5 h-5 text-zinc-500 mr-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchCategories")}
              className="w-full bg-transparent outline-none text-base text-zinc-900 placeholder:text-zinc-500 pl-1"
              aria-label="Search categories"
            />
          </div>
        </div>
        <h1 className="mt-[40px] text-[24px] font-bold">{t("categories")}</h1>
      </section>

      {/* Grid: 2 per row on mobile, 4 per row on large screens */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-stretch px-40 mt-2 w-full tracking-wide max-md:px-5 max-md:max-w-full">
        {filtered.map(({ id, name, picture }) => (
          <Link
            href={`./categories/${id}`}
            key={id}
            className="flex relative flex-col rounded-lg overflow-hidden cursor-pointer"
          >
            {picture ? (
              <div className="relative w-full h-32 md:h-40">
                <Image
                  src={picture}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-32 md:h-40 bg-gray-200" />
            )}
            <div className="flex relative flex-col gap-2 justify-center items-center self-stretch p-3">
              <h3 className="relative self-stretch text-base font-semibold tracking-wide text-center text-zinc-900 max-md:text-base max-sm:text-sm">
                <span className="text-base font-bold text-zinc-900 max-md:text-base max-sm:text-sm">
                  {name}
                </span>
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
