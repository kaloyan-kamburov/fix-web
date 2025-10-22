import * as React from "react";
import { StarRating } from "@/components/StarRating/StarRating";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

interface OfferCardProps {
  image: string;
  title: string;
  date?: string;
  timeSlot?: string;
  price: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  interval?: { date: string; start_time: string; end_time: string } | null;
  intervals?: Array<{ date: string; start_time: string; end_time: string }>;
  requestId: string;
  id: string;
}

function OfferCard({
  image,
  title,
  date,
  timeSlot,
  price,
  rating,
  reviewCount,
  imageUrl,
  interval,
  intervals,
  requestId,
  id,
}: OfferCardProps) {
  const locale = useLocale();
  const t = useTranslations();
  const intervalLines = React.useMemo(() => {
    const source: Array<{
      date: string;
      start_time: string;
      end_time: string;
    }> =
      Array.isArray(intervals) && intervals.length
        ? intervals
        : interval
        ? [interval]
        : [];
    if (source.length > 0) {
      return source.map((iv) => {
        const d = String(iv?.date || "");
        const st = String(iv?.start_time || "");
        const et = String(iv?.end_time || "");
        let formattedDate = d;
        try {
          const [y, m, day] = d.split("-").map((p) => Number(p));
          const parsed = new Date(y, (m || 1) - 1, day || 1);
          if (!Number.isNaN(parsed.getTime())) {
            formattedDate = new Intl.DateTimeFormat(locale, {
              dateStyle: "medium",
            }).format(parsed);
          }
        } catch {}
        return `${formattedDate} ${st} - ${et}`.trim();
      });
    }
    if (date || timeSlot) {
      return [`${date || ""} ${timeSlot || ""}`.trim()];
    }
    return [] as string[];
  }, [intervals, interval, date, timeSlot, locale]);
  return (
    <Link
      href={`/${locale}/offers/${id}`}
      className="flex relative gap-3 items-center self-stretch p-3 rounded-lg bg-stone-50 max-md:flex-col max-md:gap-2 max-md:items-start max-sm:gap-2 max-sm:p-2 cursor-pointer hover:bg-stone-100 transition-colors"
    >
      <div className="relative w-20 h-20 rounded-lg overflow-hidden max-sm:h-[60px] max-sm:w-[60px]">
        {image && (
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 640px) 60px, 80px"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex relative flex-col gap-2 justify-center items-start flex-[1_0_0] max-md:w-full">
        <h3 className="relative text-sm font-bold text-neutral-700 w-full max-sm:w-auto max-sm:text-xs">
          {title}
        </h3>
        <div className="flex relative flex-col gap-1 justify-center items-start self-stretch">
          <div className="relative text-sm text-neutral-700 max-sm:text-xs">
            {t("workerTime")}
          </div>
          <div className="flex relative flex-col gap-0.5 items-start self-stretch">
            {intervalLines.map((line, idx) => (
              <time
                key={`${idx}-${line}`}
                className="relative text-sm text-neutral-700 max-sm:text-xs"
              >
                {line}
              </time>
            ))}
          </div>
        </div>
        <div className="flex relative gap-2 items-center self-stretch max-md:justify-between">
          <div className="relative text-sm font-bold text-center text-zinc-900 max-sm:text-xs">
            {price}
          </div>
          <StarRating rating={rating} reviewCount={reviewCount} />
        </div>
      </div>
      <div className="flex relative gap-2 items-center p-2 rounded-3xl bg-zinc-200 max-sm:p-1.5">
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="arrow-icon"
          style={{ width: "16px", height: "16px", position: "relative" }}
        >
          <path
            d="M4.07617 13.9867L5.25617 15.1667L11.9228 8.50004L5.25617 1.83337L4.07617 3.01337L9.56284 8.50004L4.07617 13.9867Z"
            fill="#626366"
          />
        </svg>
      </div>
    </Link>
  );
}

export default OfferCard;
