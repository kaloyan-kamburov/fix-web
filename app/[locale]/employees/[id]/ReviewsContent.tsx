"use client";
import * as React from "react";
import { RatingDisplay } from "./RatingDisplay";
import { ReviewCard } from "./ReviewCard";
import { useTranslations } from "next-intl";

function RequestsContent({
  rating,
  reviews = [],
}: {
  rating: number;
  reviews?: any[];
}) {
  const t = useTranslations();
  return (
    <main className="flex flex-col max-w-[720px]">
      <RatingDisplay rating={rating} totalReviews={reviews.length} />

      <section className="flex flex-col mt-6 w-full max-md:max-w-full flex gap-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            reviewerName={review.client_name}
            serviceType={review.service_name}
            date={review.created}
            reviewText={review.text}
            rating={review.rating}
          />
        ))}
      </section>
    </main>
  );
}

export default RequestsContent;
