"use client";
import * as React from "react";
import { useTranslations } from "next-intl";
import RequestsContent from "../RequestContent";

export default function OpenReviewsButton({
  rating = 0,
  total = 0,
}: {
  rating?: number;
  total?: number;
}) {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg bg-amber-200 text-zinc-900 font-bold hover:bg-amber-300 transition-colors"
      >
        {`${Number(rating || 0).toFixed(1)} / 5 ${t("of", {
          default: "of",
        } as any)} ${Number(total || 0)} ${t("reviews", {
          default: "reviews",
        } as any)}`}
      </button>

      {open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/25 px-4">
          <div className="w-full max-w-[720px] bg-white rounded-lg shadow-lg relative max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-2  bg-white/95 backdrop-blur p-4 rounded-t-lg">
              <div className="text-lg font-bold text-zinc-900">
                {t("reviews", { default: "Reviews" } as any)}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="p-1 rounded hover:bg-gray-10"
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
                    stroke="#1C1C1D"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M5 5L15 15"
                    stroke="#1C1C1D"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 pt-4">
              <RequestsContent rating={rating} total={total} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
