import { useTranslations } from "next-intl";
import * as React from "react";

interface RatingDisplayProps {
  rating: number;
  totalReviews: number;
}

export function RatingDisplay({ rating, totalReviews }: RatingDisplayProps) {
  const t = useTranslations();
  const Star = ({ fill = 0 }: { fill: number }) => {
    const clamped = Math.max(0, Math.min(1, fill));
    return (
      <span className="relative inline-block w-5 h-5" aria-hidden>
        <svg viewBox="0 0 20 20" className="absolute inset-0 w-5 h-5">
          <path
            d="M12.1045 7.11816L12.1631 7.25684L12.3135 7.26953L17.7236 7.73926L13.6289 11.29L13.5156 11.3887L13.5498 11.5352L14.7695 16.8135L10.1309 14.0146L10.001 13.9375L9.87207 14.0146L5.23145 16.8135L6.45312 11.5352L6.4873 11.3887L6.37305 11.29L2.27832 7.73926L7.68945 7.26953L7.83984 7.25684L7.89844 7.11816L10.001 2.1416L12.1045 7.11816Z"
            fill="#E4E4E7"
            stroke="#C9C9CE"
            strokeWidth="0.5"
          />
        </svg>
        <span
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${clamped * 100}%` }}
        >
          <svg viewBox="0 0 20 20" className="w-5 h-5">
            <path
              d="M12.1045 7.11816L12.1631 7.25684L12.3135 7.26953L17.7236 7.73926L13.6289 11.29L13.5156 11.3887L13.5498 11.5352L14.7695 16.8135L10.1309 14.0146L10.001 13.9375L9.87207 14.0146L5.23145 16.8135L6.45312 11.5352L6.4873 11.3887L6.37305 11.29L2.27832 7.73926L7.68945 7.26953L7.83984 7.25684L7.89844 7.11816L10.001 2.1416L12.1045 7.11816Z"
              fill="#E5C926"
              stroke="#C59A02"
              strokeWidth="0.5"
            />
          </svg>
        </span>
      </span>
    );
  };

  const stars = Array.from({ length: 5 }).map((_, i) => {
    const idx = i + 1;
    const fill = Math.max(0, Math.min(1, rating - (idx - 1)));
    return <Star key={i} fill={fill} />;
  });

  return (
    <div className="flex gap-3 items-center self-start text-lg text-center text-neutral-700">
      <div className="flex gap-1 items-center my-auto">{stars}</div>
      <span className="my-auto text-neutral-700">
        {Number(rating || 0).toFixed(1)} {t("of")} {totalReviews}{" "}
        {t("reviews").toLowerCase()}
      </span>
    </div>
  );
}
