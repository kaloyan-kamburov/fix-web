"use client";
import { api } from "@/lib/api";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Loader from "@/components/Loader/Loader";
import { StarRating } from "./StarRating";
import { InfoField } from "./InfoField";
import { CraftsmanInfo } from "./CraftsmanInfo";
import { SecurityNotice } from "./SecurityNotice";
import formatDate from "@/lib/formatDate";

export default function OfferPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = use(params);
  const t = useTranslations();
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get(`client/offers/${id}`, {
          headers: { "app-locale": locale },
        });
        if (!cancelled) setOffer(res?.data ?? null);
      } catch (_) {
        debugger;
        console.log("here");
        if (!cancelled) setOffer({ error: true });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, locale]);

  return (
    <div className="bg-gray-10 px-[20px] w-full flex w-full max-w-[960px] flex-1 mx-auto">
      <section className="flex flex-col flex-1 justify-center pb-10 text-base font-semibold text-center bg-gray-10 text-zinc-900 pt-[88px] max-md:pt-[76px] mx-auto gap-4">
        <div className="mx-auto w-full max-w-[960px]">
          <Link
            href={`/${locale}/requests`}
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
        {loading ? (
          <div className="text-sm w-full flex flex-1 justify-center items-center">
            <Loader />
          </div>
        ) : offer?.error ? (
          <div className="flex flex-col flex-1 justify-center pb-10 text-base font-semibold text-center bg-gray-10 text-zinc-900 pt-[88px] max-md:pt-[76px] mx-auto gap-4">
            <h1 className="text-2xl font-bold text-zinc-900 max-md:text-2xl max-sm:text-xl">
              {t("error")}
            </h1>
          </div>
        ) : (
          <div className="flex flex-col gap-6 items-start p-10 mx-auto max-w-none rounded-2xl bg-stone-50 w-[640px] max-md:p-8 max-md:w-full max-md:max-w-[600px] max-sm:gap-5 max-sm:p-5 max-sm:w-full max-sm:max-w-full">
            <header className="flex flex-col gap-6 items-start self-stretch">
              <h1 className="text-2xl font-bold text-zinc-900 max-md:text-2xl max-sm:text-xl">
                {t("receivedOffer")}
              </h1>
              <h2 className="text-lg font-bold text-zinc-900 max-md:text-base max-sm:text-base">
                {offer?.order?.service_name}
              </h2>
            </header>

            <section className="flex flex-col gap-4 items-start self-stretch max-sm:gap-3">
              <div className="flex flex-col gap-1 justify-center items-start self-stretch">
                <label className="text-base text-zinc-600 font-normal">
                  {t("price")}
                </label>
                <p className="text-2xl font-bold text-zinc-900 max-md:text-2xl max-sm:text-xl">
                  {offer?.price} {offer?.currency?.symbol} /{" "}
                  {offer?.price_second} {offer?.second_currency?.symbol}
                </p>
              </div>

              <div className="flex flex-col gap-4 items-start self-stretch max-sm:gap-3">
                <div className="flex flex-col gap-2 justify-center items-start self-stretch">
                  <label className="text-base text-zinc-60 font-normal">
                    {t("rating")}
                  </label>
                  <StarRating
                    rating={offer?.review_avg_rating}
                    reviewCount={offer?.reviews_count}
                  />
                </div>

                <InfoField
                  label={t("address")}
                  value={`${offer?.order?.city}, ${offer?.order?.neighbourhood}, ${offer?.order?.address}`}
                />

                <InfoField
                  label={t("date")}
                  value={formatDate(offer?.order?.created_at, locale)}
                />
                <InfoField
                  label={t("timeRange")}
                  value={
                    Array.isArray(offer?.order?.intervals) &&
                    offer?.order?.intervals.length > 0
                      ? offer?.order?.intervals
                          .map(
                            (interval: any) =>
                              `${interval.start_time} - ${interval.end_time}`
                          )
                          .join(", ")
                      : "N/A"
                  }
                />

                <InfoField
                  label={t("exactTime")}
                  value={
                    Array.isArray(offer?.order?.client_intervals) &&
                    offer?.order?.client_intervals.length > 0
                      ? offer?.order?.client_intervals
                          .map(
                            (interval: any) =>
                              `${interval.start_time} - ${interval.end_time}`
                          )
                          .join(", ")
                      : "N/A"
                  }
                />

                <CraftsmanInfo
                  name={offer?.employee_name}
                  imageUrl={offer?.employee_picture}
                  imageAlt={offer?.employee_name}
                  locale={locale}
                />

                <div className="flex flex-col gap-2 justify-center items-start self-stretch">
                  <label className="text-base text-zinc-600">
                    {t("comment")}
                  </label>
                  <p className="text-base font-bold text-zinc-900">
                    {offer?.employee_comment || "N/A"}
                  </p>
                  <div className="flex flex-col gap-2 justify-center items-start self-stretch">
                    <label className="text-base text-zinc-600">
                      {t("quantity")}
                    </label>
                    <p className="text-base font-bold text-zinc-900">
                      {offer?.quantity || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <SecurityNotice />

            <Link
              href={`/${locale}/checkout/${offer?.id}`}
              className="flex gap-2 justify-center items-center self-stretch px-6 py-3 bg-amber-200 rounded-lg cursor-pointer"
            >
              <span className="text-base font-bold text-center text-zinc-900">
                {t("acceptAndPay")}
              </span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

// response obj:
const asd = {
  id: 374,
  currency: {
    id: 1,
    name: "BGN",
    code: "BGN",
    symbol: "BGN",
    active: 1,
  },
  rate: "1.955830",
  second_currency: {
    id: 2,
    name: "EUR",
    code: "EUR",
    symbol: "€",
    active: 1,
  },
  price: 1,
  price_second: "0.51",
  total: 1,
  total_second: "0.51",
  status: "pending",
  intervals: [],
  order: {
    id: 173,
    currency: {
      id: 1,
      name: "BGN",
      code: "BGN",
      symbol: "BGN",
      active: 1,
    },
    rate: "1.955830",
    second_currency: {
      id: 2,
      name: "EUR",
      code: "EUR",
      symbol: "€",
      active: 1,
    },
    price: 1,
    price_second: "0.51",
    price_from: 1,
    price_from_second: "0.51",
    price_to: 1,
    price_to_second: "0.51",
    use_fixed_price: true,
    kmp_commission_percentage: null,
    organization_commission_percentage: null,
    service_picture: "",
    client_intervals: [],
    employee_intervals: [],
    client_comment: null,
    employee_comment: null,
    client_paid: false,
    employee_paid: 0,
    total: null,
    phone: "0888751534",
    city: "Sofia",
    address: "Neofit Bozveli 7",
    neighbourhood: "123",
    payment_date: null,
    organization_id: null,
    client_id: 100,
    employee_id: 90,
    service_id: 3841,
    category_id: 17,
    status: "new_order",
    latitude: null,
    longitude: null,
    created_at: "2025-09-22 19:59:11",
    updated_at: "2025-09-22 19:59:11",
    service_name: "Инспекция и Оферта ФИКС",
    service_description:
      "Предлагаме преференциална инспекция на обекта за детайлизиране на строително-монтажните работи (СМР), включително професионална консултация на място и изготвяне на структурирана оферта по позиции и количествено-стойностна сметка (КСС).",
    service_metrics_type: "linear",
    services: [],
    offers_count: 1,
    employee_phone: "0896824040",
    employee_name: "Ivo Test Maistor",
    employee_picture:
      "https://kmp-admin.perspectiveunity.com/storage/315/conversions/profile_image-compressed.jpg",
    client_name: "Kaloyan Kamburov",
    client_review: null,
    request_completed_at: null,
    request_finished_at: null,
    urgent: false,
    quantity: 1,
    highlight: true,
    has_claim: false,
    country_region: {
      id: 26,
      name: "Ямбол",
      country_id: 26,
    },
  },
  order_id: 173,
  employee_id: 90,
  employee_name: "Ivo Test Maistor",
  employee_profile_picture:
    "https://kmp-admin.perspectiveunity.com/storage/315/conversions/profile_image-compressed.jpg",
  reviews_count: 1,
  review_avg_rating: 5,
};
