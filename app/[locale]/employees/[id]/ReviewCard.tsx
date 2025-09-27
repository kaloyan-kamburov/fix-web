import { StarRating } from "@/components/StarRating/StarRating";
import { useTranslations } from "next-intl";
import * as React from "react";

interface ReviewCardProps {
  reviewerName: string;
  serviceType: string;
  date: string;
  reviewText: string;
  hasBorder?: boolean;
  rating: number;
}

export function ReviewCard({
  reviewerName,
  serviceType,
  date,
  reviewText,
  hasBorder = false,
  rating = 1,
}: ReviewCardProps) {
  const t = useTranslations();
  const borderClass = hasBorder ? "border border-solid border-zinc-100" : "";

  return (
    <div
      className={`flex flex-col p-4 w-full rounded-lg bg-stone-50 ${borderClass} max-md:max-w-full w-full`}
    >
      <header className="self-start text-sm">
        <h3 className="font-bold text-zinc-900">{reviewerName}</h3>
        <StarRating
          rating={rating}
          reviewCount={rating}
          showTotalCount={false}
        />
        <p className="mt-1 text-base text-zinc-600">{serviceType}</p>
        <div className="flex gap-2 items-center mt-1 text-zinc-500">
          <time className="self-stretch my-auto text-zinc-500">{date}</time>
        </div>
      </header>
      <p className="mt-2 text-base text-zinc-900 max-md:max-w-full">
        {reviewText}
      </p>
    </div>
  );
}
