import { api } from "@/lib/api";
import Image from "next/image";
import ServicesSearch from "@/components/Services/ServicesSearch";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string; locale: string }>;
}) {
  const { category, locale } = await params;
  const id = category;
  const t = await getTranslations({ locale });
  let services: unknown = null;
  let categoryData: unknown = null;
  try {
    const res = await api.get(`categories/${id}/services`, {
      headers: {
        "app-locale": locale,
      },
    });
    services = res.data;
  } catch (_) {
    services = { error: true };
  }

  try {
    const resCat = await api.get(`categories/${id}`, {
      headers: {
        "app-locale": locale,
      },
    });
    categoryData = resCat.data;
  } catch (_) {
    categoryData = null;
  }

  const cat: any = categoryData;
  const categoryName = cat
    ? typeof cat === "object" && cat !== null && typeof cat.name === "string"
      ? cat.name
      : Array.isArray((cat as any)?.data) && (cat as any).data.length
      ? String((cat as any).data[0]?.name || "")
      : ""
    : "";

  return (
    <div className="bg-gray-10 w-full">
      <section className="flex flex-col justify-center pb-10 text-base font-semibold text-center bg-gray-10 text-zinc-900 pt-[88px] max-md:pt-[76px] mx-auto gap-4">
        <div className="mx-auto w-full max-w-[1440px]">
          <Link
            href={`/${locale}/categories/`}
            className="flex relative gap-2 items-center self-stretch cursor-pointer max-sm:gap-1.5 w-fit mt-4"
            aria-label={t("back")}
          >
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 7.5H3.83L9.42 1.91L8 0.5L0 8.5L8 16.5L9.41 15.09L3.83 9.5H16V7.5Z"
                fill="#1C1C1D"
              />
            </svg>
            <div className="relative text-lg font-bold text-center text-zinc-900 max-md:text-base max-sm:text-sm">
              <div className="text-lg font-bold text-zinc-900 max-md:text-base max-sm:text-sm">
                {t("back")}
              </div>
            </div>
          </Link>
        </div>
        <h1 className="text-2xl text-zinc-900 max-md:max-w-full text-left w-full max-w-[960px] mx-auto mt-[20px] max-md:mt-0">
          {categoryName || t("categories")}
        </h1>
        <ServicesSearch
          initialData={services}
          locale={locale}
          categoryId={id}
          isUrgent={false}
        />
      </section>
    </div>
  );
}
