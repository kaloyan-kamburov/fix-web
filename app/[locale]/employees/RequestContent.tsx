"use client";
import * as React from "react";
import { RatingDisplay } from "./[id]/RatingDisplay";
import { ReviewCard } from "./[id]/ReviewCard";

const reviewsData = [
  {
    id: 1,
    reviewerName: "Дарина Пеева",
    serviceType: "Смяна на тръба",
    starsImageSrc:
      "https://api.builder.io/api/v1/image/assets/TEMP/d48d6c4fb8bf54f6842dd123ebfb2ced73e94c40?placeholderIfAbsent=true&apiKey=042670c1c1e54b9ca6a013c582610f50",
    date: "Май 2024",
    reviewText:
      "Всичко беше супер, доволна съм от услугата, взимам 1 звезда заради закъснението",
    hasBorder: true,
  },
  {
    id: 2,
    reviewerName: "Симеон Танев",
    serviceType: "Смяна на тръба",
    starsImageSrc:
      "https://api.builder.io/api/v1/image/assets/TEMP/b928cec149d05caed24d0b66f492265f5a6f5df2?placeholderIfAbsent=true&apiKey=042670c1c1e54b9ca6a013c582610f50",
    date: "Май 2024",
    reviewText: "Перфектно изпълнение",
    hasBorder: false,
  },
  {
    id: 3,
    reviewerName: "Иван Михайлов",
    serviceType: "Смяна на тръба",
    starsImageSrc:
      "https://api.builder.io/api/v1/image/assets/TEMP/1c17b59ae53afc7cec324d2e5686215844571a26?placeholderIfAbsent=true&apiKey=042670c1c1e54b9ca6a013c582610f50",
    date: "Май 2024",
    reviewText:
      "Майстора нямаше необходимите инструменти и се забави прекалено много",
    hasBorder: false,
  },
];

function RequestsContent() {
  return (
    <main className="flex flex-col max-w-[720px]">
      <h1 className="text-2xl font-bold text-zinc-900">Отзиви</h1>

      <RatingDisplay
        rating={3.5}
        totalReviews={4}
        starsImageSrc="https://api.builder.io/api/v1/image/assets/TEMP/e3c2726a3f3e2c0ab6a62f178b21f8beb88a7480?placeholderIfAbsent=true&apiKey=042670c1c1e54b9ca6a013c582610f50"
      />

      <section className="mt-6 w-full max-md:max-w-full">
        {reviewsData.map((review, index) => (
          <div key={review.id} className={index > 0 ? "mt-4" : ""}>
            <ReviewCard
              reviewerName={review.reviewerName}
              serviceType={review.serviceType}
              starsImageSrc={review.starsImageSrc}
              date={review.date}
              reviewText={review.reviewText}
              hasBorder={review.hasBorder}
            />
          </div>
        ))}
      </section>
    </main>
  );
}

export default RequestsContent;
