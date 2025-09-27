"use client";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import * as React from "react";

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  reviewCount: number;
  showTotalCount?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  reviewCount,
  showTotalCount = true,
}) => {
  const t = useTranslations();
  const filledStars = Math.floor(rating);
  const emptyStars = totalStars - filledStars;

  return (
    <div className="flex justify-between items-center self-stretch max-sm:flex-col max-sm:gap-2 max-sm:items-start">
      <div className="flex gap-0.5 items-center">
        <div className="flex items-center">
          {/* Filled stars */}
          {Array.from({ length: filledStars }).map((_, index) => (
            <div key={`filled-${index}`}>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="star-filled" style="width: 20px; height: 20px"> <path d="M11.8721 7.21582L11.9893 7.49316L12.2891 7.51855L17.1123 7.9375L13.4639 11.1016L13.2363 11.2988L13.3037 11.5918L14.3916 16.2949L10.2578 13.8008L9.99902 13.6455L9.74121 13.8008L5.60645 16.2949L6.69434 11.5918L6.7627 11.2988L6.53516 11.1016L2.88477 7.9375L7.70898 7.51855L8.00977 7.49316L8.12695 7.21582L9.99902 2.7832L11.8721 7.21582Z" fill="#E5C926" stroke="#C59A02"></path> </svg>',
                }}
              />
            </div>
          ))}
          {/* Empty stars */}
          {Array.from({ length: emptyStars }).map((_, index) => (
            <div key={`empty-${index}`}>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="star-empty" style="width: 20px; height: 20px"> <path d="M11.8721 7.21582L11.9893 7.49316L12.2891 7.51855L17.1123 7.9375L13.4639 11.1016L13.2363 11.2988L13.3037 11.5918L14.3916 16.2949L10.2578 13.8008L9.99902 13.6455L9.74121 13.8008L5.60645 16.2949L6.69434 11.5918L6.7627 11.2988L6.53516 11.1016L2.88477 7.9375L7.70898 7.51855L8.00977 7.49316L8.12695 7.21582L9.99902 2.7832L11.8721 7.21582Z" stroke="#C59A02"></path> </svg>',
                }}
              />
            </div>
          ))}
        </div>
        {showTotalCount && (
          <p
            className={`text-base text-center text-neutral-700 ${
              reviewCount > 0 ? "pl-2" : ""
            }`}
          >
            {(rating || 0).toFixed(1)} {t("of")} {reviewCount || 0}{" "}
            {t("reviews").toLowerCase()}
          </p>
        )}
      </div>
    </div>
  );
};
