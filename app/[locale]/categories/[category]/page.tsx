import { api } from "@/lib/api";
import Image from "next/image";
import ServicesSearch from "@/components/Services/ServicesSearch";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function CategoryPage({
  params,
}: {
  params: { category: string; locale: string };
}) {
  const id = params.category;
  const t = await getTranslations({ locale: params.locale });
  let services: unknown = null;
  try {
    const res = await api.get(`categories/${id}/services`, {
      headers: {
        "app-locale": params?.locale,
      },
    });
    services = res.data;
  } catch (_) {
    services = { error: true };
  }

  return (
    <div className="bg-zinc-100 px-[20px]">
      {/* <header>
        <h1 className="text-2xl text-zinc-900 max-md:max-w-full">
          Техническа поддръжка на сгради и съоръжения
        </h1>
        <p className="mt-4 text-zinc-500 max-md:max-w-full">3 резултата</p>
      </header> */}

      <section className="flex flex-col justify-center pb-10 text-base font-semibold text-center bg-zinc-100 text-zinc-900 pt-[88px] max-md:pt-[76px] mx-auto gap-4">
        <div className="mx-auto w-full max-w-[960px]">
          <Link
            href={`/${params.locale}/categories/`}
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

        <ServicesSearch initialData={services} locale={params.locale} />
      </section>
    </div>
  );
}
