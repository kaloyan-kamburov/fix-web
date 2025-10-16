"use client";
import * as React from "react";
import { useTranslations } from "next-intl";
import RequestsContent from "./ReviewsContent";
import { StarRating } from "@/components/StarRating/StarRating";

export default function OpenReviewsButton({
  reviews = [],
}: {
  reviews?: any[];
}) {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);

  const rating =
    reviews?.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const total = reviews?.length;

  return (
    <>
      <div className="flex md:flex-row flex-col gap-1 items-start md:items-center mx-auto md:mx-0">
        <StarRating rating={rating} reviewCount={rating} />
        <span
          className="text-sm font-bold text-center text-neutral-700 cursor-pointer hover:underline mx-auto md:mx-0"
          onClick={() => setOpen(true)}
        >
          {t("viewAll")}
        </span>
      </div>

      {open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/25 px-4">
          <div className="w-full max-w-[720px] bg-white rounded-lg shadow-lg relative max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-2  bg-white/95 backdrop-blur p-4 rounded-t-lg">
              <div className="text-lg font-bold text-zinc-900">
                {t("reviews")}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="p-1 rounded"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 5L5 15"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="stroke-gray-90"
                  />
                  <path
                    d="M5 5L15 15"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="stroke-gray-90"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <RequestsContent rating={rating || 0} reviews={reviews} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
