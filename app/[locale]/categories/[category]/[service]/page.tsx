import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { getTranslations } from "next-intl/server";

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; category: string; service: string }>;
}) {
  const { locale, category, service: serviceId } = await params;
  const lang = (locale || "bg").split("-")[0];
  const t = await getTranslations({ locale: lang });
  let service: unknown = null;

  try {
    const res = await api.get(`services/${serviceId}`, {
      headers: { "app-locale": lang },
    });
    service = res.data;
  } catch (_) {
    service = { error: true };
  }

  const s: any = service || {};
  const name = String(s?.name || "");
  const description = String(s?.description || "");
  const picture = String(s?.picture || "");
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

  return (
    <section className="flex flex-col justify-start w-full pb-10 text-base font-semibold text-center bg-gray-10 text-zinc-900 pt-[58px] max-md:pt-[44px] mx-auto gap-4">
      <div className="mx-auto w-full">
        <Link
          href={
            category === "emergencies"
              ? `/${locale}/emergencies`
              : `/${locale}/categories/${category}`
          }
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
      <div className="max-w-[720px] mx-auto mt-[20px] max-md:mt-0">
        <h1 className="text-2xl font-bold text-neutral-700 text-left">
          {name}
        </h1>
        {picture && (
          <Image
            src={picture}
            alt={name}
            width={1200}
            height={506}
            sizes="100vw"
            className="object-contain mt-6 w-full rounded-xl"
          />
        )}
        <div className="flex gap-4 justify-center items-start self-start mt-6 justify-start">
          <p className="text-base text-zinc-500 text-left font-normal leading-[28px]">
            <span>{t("servicePrice")}</span>
            <span className="text-lg font-bold text-center text-zinc-900 pl-4">
              {primary ? (
                <>
                  {primary} {currency}
                </>
              ) : null}
              {secondary ? (
                <>
                  {" "}
                  ({secondary} {currency2})
                </>
              ) : null}
            </span>
          </p>
        </div>

        <p className="mt-6 text-lg text-zinc-600 max-md:max-w-full text-left font-normal">
          {description}
        </p>

        <Link
          href={`/${locale}/request/${serviceId}`}
          className="flex gap-2 justify-center items-center px-6 py-3 mt-6 w-full text-base font-semibold text-center bg-amber-200 rounded-lg text-zinc-900 max-md:px-5 max-md:max-w-full hover:bg-amber-300 transition-colors"
        >
          <span className="self-stretch my-auto text-zinc-900">
            {t("sendRequest")}
          </span>
        </Link>
      </div>
    </section>
  );
}
