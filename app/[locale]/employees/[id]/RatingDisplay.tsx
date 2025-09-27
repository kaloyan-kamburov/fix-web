import { useTranslations } from "next-intl";
import * as React from "react";

interface RatingDisplayProps {
  rating: number;
  totalReviews: number;
  starsImageSrc: string;
}

export function RatingDisplay({
  rating,
  totalReviews,
  starsImageSrc,
}: RatingDisplayProps) {
  const t = useTranslations();
  return (
    <div className="flex gap-4 items-center self-start mt-6 text-lg text-center text-neutral-700">
      <div className="flex gap-0.5 items-center self-stretch my-auto min-w-60">
        <img
          src={starsImageSrc}
          alt={`${rating} stars rating`}
          className="object-contain shrink-0 self-stretch my-auto w-40 aspect-[5]"
        />
        <span className="self-stretch my-auto text-neutral-700">
          {rating} {t("of")} {totalReviews} {t("reviews")}
        </span>
      </div>
    </div>
  );
}
