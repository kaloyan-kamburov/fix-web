import { useTranslations } from "next-intl";
import * as React from "react";

interface StarRatingProps {
  rating: number;
  reviewCount: number;
}

function StarRating({ rating, reviewCount }: StarRatingProps) {
  const t = useTranslations();

  return (
    <div className="flex relative gap-1 justify-center items-center rounded">
      <div className="flex relative gap-0.5 items-center">
        <div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="rating-star"
            style={{ width: "20px", height: "20px", position: "relative" }}
          >
            <path
              d="M12.1045 7.11816L12.1631 7.25684L12.3135 7.26953L17.7236 7.73926L13.6289 11.29L13.5156 11.3887L13.5498 11.5352L14.7695 16.8135L10.1309 14.0146L10.001 13.9375L9.87207 14.0146L5.23145 16.8135L6.45312 11.5352L6.4873 11.3887L6.37305 11.29L2.27832 7.73926L7.68945 7.26953L7.83984 7.25684L7.89844 7.11816L10.001 2.1416L12.1045 7.11816Z"
              fill="#E5C926"
              stroke="#C59A02"
              strokeWidth="0.5"
            />
          </svg>
        </div>
        <span className="relative text-sm tracking-wider text-center text-neutral-700 max-sm:text-xs">
          {rating.toFixed(1)}
        </span>
      </div>
      <span className="relative text-sm text-center text-neutral-700 max-sm:text-xs">
        {t("of")} {reviewCount} {t("reviews")}
      </span>
    </div>
  );
}

export default StarRating;
