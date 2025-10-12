import Link from "next/link";
import { getTranslations } from "next-intl/server";
import RequestForm from "@/components/Request/RequestForm";
import { api } from "@/lib/api";

const RequestPage = async ({
  params,
}: {
  params: Promise<{ locale: string; serviceId: string }>;
}) => {
  const { locale, serviceId: serviceSlug } = await params;
  const lang = (locale || "bg").split("-")[0];
  const t = await getTranslations({ locale: lang });
  let service: unknown = null;
  try {
    const res = await api.get(`services/${serviceSlug}`);
    service = res.data;
  } catch (_) {
    service = { error: true };
  }

  const s: any = service || {};
  const name = String(s?.name || "");
  const serviceNumericId = (() => {
    const raw = (s as any)?.id;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? String(n) : "";
  })();
  const categoryId: string | null =
    s?.category_id != null ? String(s.category_id) : null;
  const backHref = categoryId
    ? `/${locale}/categories/${categoryId}/${serviceSlug}`
    : `/${locale}/categories`;
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

  // Fetch cities for select
  let cities: string[] = [];
  try {
    const resCities = await api.get("cities");
    const payload = resCities?.data;
    if (Array.isArray(payload))
      cities = payload.filter((x: any) => typeof x === "string");
    else if (Array.isArray(payload?.data))
      cities = payload.data.filter((x: any) => typeof x === "string");
  } catch {}
  return (
    <section className="flex flex-col pt-[58px] max-md:pt-[44px] w-full px-[16px]">
      <div className="mx-auto flex justify-start w-full max-w-[1440px]">
        <Link
          href={backHref}
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
      <div className="mx-auto w-full max-w-[720px] bg-gray-00 p-10 max-md:p-5 rounded-2xl mt-[20px]">
        <RequestForm
          name={name}
          serviceId={serviceNumericId}
          locale={locale}
          pricePrimary={primary}
          priceSecondary={secondary}
          currency={currency}
          currency2={currency2}
          categoryId={categoryId || undefined}
          cities={cities}
        />
      </div>
    </section>
  );
};

export default RequestPage;
