"use client";
import { useEffect, useMemo, useState, use } from "react";
import { api } from "@/lib/api";
import { useLocale, useTranslations } from "next-intl";
import OfferCard from "./OfferCard";
import Loader from "@/components/Loader/Loader";
import Link from "next/link";
import Image from "next/image";
import FsLightbox from "fslightbox-react";
import { Button } from "@/components/ui/button";
import ReviewForm from "../../employees/[id]/ReviewForm";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import EmployeeCard from "@/components/EmployeeCard/EmployeeCard";

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
  const [togglerBefore, setTogglerBefore] = useState(false);
  const [togglerAfter, setTogglerAfter] = useState(false);
  const [slide, setSlide] = useState(1);
  const [showMarkAsCompletedModal, setShowMarkAsCompletedModal] =
    useState(false);
  const [markAsCompletedLoading, setMarkAsCompletedLoading] = useState(false);
  const [openReviewsModal, setOpenReviewsModal] = useState(false);

  const markAsCompleted = async () => {
    try {
      setMarkAsCompletedLoading(true);
      await api.put(`client/orders/${id}`, {
        status: "request_finished",
      });
      toast.success(t("markAsCompletedSuccess"));
      setOrder({ ...order, status: "request_finished" });
      window.scrollTo({ top: 0, behavior: "smooth" });
      setOpenReviewsModal(true);
    } finally {
      setMarkAsCompletedLoading(false);
      setShowMarkAsCompletedModal(false);
    }
  };

  const fetchData = async (silent: boolean) => {
    if (!silent) setLoading(true);
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
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="flex relative flex-col gap-6 items-start w-full">
        <div className="mx-auto w-full">
          <Link
            href={`/${routeLocale}/requests#${
              order?.status === "new_order"
                ? "sent"
                : ["approved_offer", "request_completed"].includes(
                    order?.status
                  )
                ? "active"
                : ["request_finished", "paid"].includes(order?.status)
                ? "history"
                : "sent"
            }`}
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

        <div className="flex relative flex-col p-10 rounded-[16px] bg-white mx-auto w-full max-w-[720px]">
          <h1 className="relative text-2xl font-bold text-zinc-900 max-sm:text-xl">
            {order?.status === "new_order" && t("request")}
            {["approved_offer", "request_completed"].includes(order?.status) &&
              t("activeRequest")}
            {["request_finished", "paid"].includes(order?.status) &&
              t("completedRequest")}
          </h1>
          <h2 className="relative text-lg font-bold text-zinc-900 max-sm:text-base mt-4">
            {title}
          </h2>

          <div className="flex flex-col relative gap-2 items-center self-stretch rounded-xl max-md:flex-wrap max-sm:gap-1 mt-4">
            <div className="flex flex-col relative  gap-2 items-start self-stretch">
              {order?.status !== "new_order" && (
                <span className="text-base text-zinc-600">{t("before")}</span>
              )}
              <div className="flex relative gap-2 items-center self-stretch rounded-xl max-md:flex-wrap max-sm:gap-1">
                {(Array.isArray(order?.pictures_before)
                  ? order.pictures_before
                  : []
                ).map((src: string, idx: number) => (
                  <div
                    key={`${idx}-${src}`}
                    className="relative w-24 h-20 rounded-lg overflow-hidden max-sm:w-20 max-sm:h-16 cursor-pointer hover:opacity-80 transition-opacity border-1 border-gray-30"
                    onClick={() => {
                      setTogglerBefore(!togglerBefore);
                      setSlide(idx + 1);
                    }}
                  >
                    {src && (
                      <Image
                        src={String(src)}
                        alt={title || "image"}
                        fill
                        sizes="(max-width: 640px) 96px, 80px"
                        className="object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col relative  gap-2 items-start self-stretch">
              {order?.status !== "new_order" && (
                <span className="text-base text-zinc-600">{t("after")}</span>
              )}
              {order?.status !== "new_order" && (
                <>
                  {Array.isArray(order?.pictures_after) &&
                  order?.pictures_after?.length > 0 ? (
                    order.pictures_after.map((src: string, idx: number) => (
                      <div
                        key={`${idx}-${src}`}
                        className="relative w-24 h-20 rounded-lg overflow-hidden max-sm:w-20 max-sm:h-16 cursor-pointer border-1 border-gray-30 hover:opacity-80 transition-opacity"
                        onClick={() => {
                          setTogglerAfter(!togglerAfter);
                          setSlide(idx + 1);
                        }}
                      >
                        {src && (
                          <Image
                            src={String(src)}
                            alt={title || "image"}
                            fill
                            sizes="(max-width: 640px) 96px, 80px"
                            className="object-cover border-1 border-gray-30"
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center items-center relative w-24 h-24 rounded-lg overflow-hidden max-sm:w-20 max-sm:h-20 p-2 border-1 border-gray-30 bg-gray-10">
                      <Image
                        src="/camera.webp"
                        alt="camera"
                        width={53}
                        height={53}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {order?.status !== "new_order" && (
            <section className="flex relative flex-col gap-4 items-start self-stretch mt-[20px]">
              <EmployeeCard
                name={order?.employee_name}
                phone={order?.employee_phone}
                rating={order?.review_avg_rating}
                reviewCount={order?.reviews_count}
                id={String(order?.employee_id || "")}
              />
            </section>
          )}
          <section className="flex relative flex-col gap-4 items-start self-stretch mt-[20px]">
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

          {order?.status === "new_order" ? (
            <section className="flex relative flex-col gap-4 items-start self-stretch p-5 mt-5 rounded-xl offers-bg max-md:p-4 max-sm:gap-3 max-sm:p-3">
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
                          price={String(
                            offer?.price != null ? offer.price : ""
                          )}
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
          ) : null}
          {["approved_offer", "request_completed"].includes(order?.status) && (
            <div className="mt-[20px] flex flex-col gap-1">
              <div className="text-base bg-gray-10 text-center text-xs py-1 max-sm:text-sm">
                {order?.status === "request_completed"
                  ? t("requestCompleted")
                  : t("notCompletedYet")}
              </div>

              {["request_completed", "approved_offer"].includes(
                order?.status
              ) && (
                <Button
                  type="submit"
                  disabled={order?.status !== "request_completed"}
                  className="flex items-center justify-center gap-2 px-6 py-3 w-full bg-accentaccent rounded-lg h-auto hover:bg-accentaccent/90 cursor-pointer"
                  onClick={() => setShowMarkAsCompletedModal(true)}
                >
                  <span className="font-button font-[number:var(--button-font-weight)] text-gray-100 text-[length:var(--button-font-size)] text-center tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)]">
                    {t("markAsCompleted")}
                  </span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      {order?.pictures_before?.length ? (
        <FsLightbox
          toggler={togglerBefore}
          sources={order?.pictures_before}
          types={order?.pictures_before?.map(() => "image")}
          slide={slide}
          onClose={() => setSlide(1)}
        />
      ) : null}
      {order?.pictures_after?.length ? (
        <FsLightbox
          toggler={togglerAfter}
          sources={order?.pictures_after}
          types={order?.pictures_after?.map(() => "image")}
          slide={slide}
          onClose={() => setSlide(1)}
        />
      ) : null}
      {showMarkAsCompletedModal &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/25 px-4">
            <div className="w-full max-w-[520px] bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-100 mb-4 text-center">
                {t("markAsCompletedQuestion")}
              </h2>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowMarkAsCompletedModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-[#dadade] text-gray-100 hover:bg-gray-10 cursor-pointer"
                  disabled={markAsCompletedLoading}
                >
                  {t("no")}
                </button>
                <button
                  onClick={markAsCompleted}
                  className="flex-1 flex justify-center items-center px-5 py-2.5 rounded-lg bg-button-primary-bg text-black hover:bg-button-primary-bg/90 focus:outline-none focus:ring-2 focus:ring-button-primary-bg cursor-pointer disabled:opacity-50 disabled:cursor-default"
                  disabled={markAsCompletedLoading}
                >
                  {markAsCompletedLoading ? (
                    <Loader className="max-w-[24px] max-h-[24px]" />
                  ) : (
                    t("yes")
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      {openReviewsModal &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/25 px-4">
            <div className="w-full max-w-[520px] bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-100 mb-4 text-center">
                {t("addReview")}
              </h2>
              <ReviewForm
                employeeId={String(order?.employee_id || "")}
                defaultOrderId={String(order?.id || id)}
                onSuccess={async () => {
                  setOpenReviewsModal(false);
                  await fetchData(true);
                }}
                onCancel={() => setOpenReviewsModal(false)}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
