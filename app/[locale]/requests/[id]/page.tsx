"use client";
import { useEffect, useMemo, useState, use } from "react";
import { api } from "@/lib/api";
import { useLocale, useTranslations } from "next-intl";
import OfferCard from "./OfferCard";
import Loader from "@/components/Loader/Loader";
import Link from "next/link";
import Image from "next/image";

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex relative flex-col gap-2 justify-center items-start self-stretch">
      <div className="relative text-base text-zinc-600 max-sm:text-sm">
        {label}
      </div>
      <div className="relative text-base font-bold text-zinc-900 max-sm:text-sm">
        {value}
      </div>
    </div>
  );
}

export default function RequestPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const { id, locale: routeLocale } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [o, off] = await Promise.all([
          api.get(`client/orders/${id}`),
          api.get(`client/orders/${id}/offers`),
        ]);
        setOrder(o?.data || null);
        const root = off?.data;
        const arr = Array.isArray(root)
          ? root
          : Array.isArray(root?.data)
          ? root.data
          : [];
        setOffers(arr);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const title = String(order?.service_name || "");
  const primary = useMemo(() => {
    const useFixed = !!order?.use_fixed_price;
    const priceFrom =
      order?.price_from != null ? String(order.price_from) : null;
    const priceTo = order?.price_to != null ? String(order.price_to) : null;
    const fixedPrice = order?.price != null ? String(order.price) : null;
    const currency = String(
      order?.currency?.symbol || order?.currency?.code || ""
    );
    const val = useFixed
      ? fixedPrice
      : priceFrom && priceTo
      ? `${priceFrom} - ${priceTo}`
      : priceFrom || priceTo || null;
    return val ? `${val} ${currency}` : "";
  }, [order]);

  const firstInterval = useMemo(() => {
    const interval = Array.isArray(order?.client_intervals)
      ? order.client_intervals[0]
      : undefined;
    const start = String(interval?.start_time || "");
    const stop = String(interval?.end_time || "");
    return start && stop ? `${start} - ${stop}` : "";
  }, [order]);

  const dateLabel = useMemo(() => {
    const raw = String(order?.created_at || "");
    if (!raw) return "";
    const isoCandidate = raw.includes(" ") ? raw.replace(" ", "T") : raw;
    let parsed = new Date(isoCandidate);
    if (Number.isNaN(parsed.getTime())) {
      parsed = new Date(raw);
    }
    if (Number.isNaN(parsed.getTime())) return "";
    try {
      return new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(parsed);
    } catch {
      return parsed.toLocaleString();
    }
  }, [order, locale]);

  const address = useMemo(() => {
    const c = String(order?.city || "");
    const n = String(order?.neighbourhood || "");
    const a = String(order?.address || "");
    return [c, n, a].filter(Boolean).join(", ");
  }, [order]);

  const qty = order?.quantity != null ? String(order.quantity) : "1";

  return loading ? (
    <div className="flex justify-center items-center h-full flex-1">
      <Loader />
    </div>
  ) : (
    <>
      <div className="flex relative flex-col gap-6 items-start w-[640px] max-md:px-5 max-md:py-0 max-md:w-full max-md:max-w-screen-sm max-sm:gap-5 max-sm:px-4 max-sm:py-0 max-sm:w-full">
        <div className="mx-auto w-full max-w-[960px]">
          <Link
            href={`/${routeLocale}/requests/`}
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
        <h1 className="relative text-2xl font-bold text-zinc-900 max-sm:text-xl">
          {t("request")}
        </h1>
        <h2 className="relative text-lg font-bold text-zinc-900 max-sm:text-base">
          {title}
        </h2>

        <div className="flex relative gap-2 items-center self-stretch rounded-xl max-md:flex-wrap max-sm:gap-1">
          {(Array.isArray(order?.pictures_before)
            ? order.pictures_before
            : []
          ).map((src: string, idx: number) => (
            <div
              key={`${idx}-${src}`}
              className="relative w-24 h-20 rounded-lg overflow-hidden max-sm:w-20 max-sm:h-16"
            >
              {src && (
                <Image
                  src={String(src)}
                  alt={title || "image"}
                  fill
                  sizes="(max-width: 640px) 80px, 96px"
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
          ))}
        </div>

        <section className="flex relative flex-col gap-4 items-start self-stretch">
          <InfoItem label={t("servicePrice")} value={primary} />
          <InfoItem label={t("date")} value={dateLabel} />
          <InfoItem label={t("timeRange")} value={firstInterval} />
          <InfoItem label={t("address")} value={address} />
          <div className="flex relative flex-col gap-2 justify-center items-start self-stretch">
            <div className="relative text-base text-zinc-600 max-sm:text-sm">
              {t("comment")}
            </div>
            <p className="relative self-stretch text-base font-bold text-zinc-900 max-sm:text-sm">
              {String(order?.client_comment || "N/A")}
            </p>
          </div>
          <InfoItem label={t("quantity")} value={qty} />
        </section>

        <section className="flex relative flex-col gap-4 items-start self-stretch p-5 rounded-xl offers-bg max-md:p-4 max-sm:gap-3 max-sm:p-3">
          <h2 className="relative text-2xl font-bold text-black max-sm:text-xl capitalize">
            {t("offers")}
          </h2>
          <div className="flex relative flex-col gap-2 items-start self-stretch">
            <div className="flex relative flex-col gap-4 items-start self-stretch">
              {offers.length > 0 ? (
                offers.map((offer: any, index: number) => {
                  const intervalsArr = Array.isArray(offer?.intervals)
                    ? offer.intervals
                    : offer?.intervals
                    ? [offer.intervals]
                    : [];
                  return (
                    <OfferCard
                      key={index}
                      requestId={String(order?.id || "")}
                      id={String(offer?.id || "")}
                      title={String(offer?.employee_name || "")}
                      price={String(offer?.price != null ? offer.price : "")}
                      rating={Number(offer?.review_avg_rating || 0)}
                      reviewCount={Number(offer?.reviews_count || 0)}
                      imageUrl={String(offer?.employee_picture || "")}
                      intervals={intervalsArr}
                    />
                  );
                })
              ) : (
                <div className="text-sm text-zinc-500 text-center">
                  {t("noOffers")}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
