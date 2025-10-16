import { api } from "@/lib/api";
import Image from "next/image";
import ServicesSearch from "@/components/Services/ServicesSearch";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export default async function EmergenciesPage({
  params,
}: {
  params: Promise<{ category: string; locale: string }>;
}) {
  const { category: id, locale } = await params;
  const lang = (locale || "bg").split("-")[0];
  const t = await getTranslations({ locale: lang });
  let services: unknown = null;
  let categoryData: unknown = null;
  try {
    const res = await api.get(`categories/${id}/services`, {
      headers: {
        "app-locale": lang,
      },
    });
    services = res.data;
  } catch (_) {
    services = { error: true };
  }

  try {
    const resCat = await api.get(`categories/${id}`, {
      headers: {
        "app-locale": lang,
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
      <section className="flex flex-col justify-center pb-10 text-base font-semibold text-center bg-gray-10 text-zinc-900 pt-[58px] max-md:pt-[48px] mx-auto gap-4">
        <div className="mx-auto w-full">
          <Link
            href={`/${locale}/emergencies/`}
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

        <article className="flex relative gap-6 items-center p-5 bg-white rounded-lg border border-[var(--color-brand-red)] border-solid max-w-[400px] max-md:gap-5 max-md:p-5 max-sm:flex-col max-sm:gap-4 max-sm:items-center max-sm:p-4 max-sm:text-center">
          <Image
            src="/siren.webp"
            alt="siren"
            width={64}
            height={64}
            className="shrink-0"
          />

          <section className="flex relative flex-col gap-4 items-start w-[265px] max-md:flex-1 max-md:w-auto max-sm:gap-3 max-sm:items-center max-sm:w-full">
            <span className="text-lg font-bold text-zinc-900 max-sm:text-base text-left">
              {t("forEmegencySituations")}
            </span>
            <div className="flex relative gap-4 items-center self-stretch">
              <p className="relative text-base font-semibold text-center text-black max-md:text-base max-sm:text-sm">
                <span className="text-base font-bold text-black max-md:text-base max-sm:text-sm">
                  +359 89 030 892
                </span>
              </p>
            </div>
          </section>
        </article>

        <div className="mx-auto w-full">
          <article className="flex relative gap-6 items-center p-5 bg-white rounded-lg border border-[var(--color-brand-red)] border-solid max-w-[400px] max-md:gap-5 max-md:p-5 max-sm:flex-col max-sm:gap-4 max-sm:items-center max-sm:p-4 max-sm:text-center">
            <Image
              src="/siren.webp"
              alt="siren"
              width={64}
              height={64}
              className="shrink-0"
            />

            <section className="flex relative flex-col gap-4 items-start w-[265px] max-md:flex-1 max-md:w-auto max-sm:gap-3 max-sm:items-center max-sm:w-full">
              <span className="text-lg font-bold text-zinc-900 max-sm:text-base text-left">
                {t("forEmegencySituations")}
              </span>
              <div className="flex relative gap-4 items-center self-stretch">
                <p className="relative text-base font-semibold text-center text-black max-md:text-base max-sm:text-sm">
                  <span className="text-base font-bold text-black max-md:text-base max-sm:text-sm">
                    +359 89 030 892
                  </span>
                </p>
              </div>
            </section>
          </article>
        </div>

        <h1 className="text-2xl text-zinc-900 max-md:max-w-full text-left w-full max-w-[960px] mx-auto mt-[20px] max-md:mt-0">
          {categoryName || t("emergencyServices")}
        </h1>

        <ServicesSearch initialData={services} locale={locale} isUrgent />
      </section>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; locale: string }>;
}): Promise<Metadata> {
  const { category, locale } = await params;
  const lang = (locale || "bg").split("-")[0];
  const t = await getTranslations({ locale: lang });
  const resCat = await api.get(`categories/${category}`, {
    headers: {
      "app-locale": lang,
    },
  });
  const cat: any = resCat.data;
  const categoryName = cat?.name || "";
  const picture = cat?.picture || "";
  return {
    title: `FIX | ${categoryName}`,
    description: t("forEmegencySituations"),
    openGraph: {
      title: `FIX | ${categoryName}`,
      description: t("forEmegencySituations"),
      type: "website",
      locale: lang,
      images: picture ? [{ url: picture }] : undefined,
    },
  };
}
