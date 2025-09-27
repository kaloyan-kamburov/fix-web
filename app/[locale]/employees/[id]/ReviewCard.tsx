import * as React from "react";

interface ReviewCardProps {
  reviewerName: string;
  serviceType: string;
  starsImageSrc: string;
  date: string;
  reviewText: string;
  hasBorder?: boolean;
}

export function ReviewCard({
  reviewerName,
  serviceType,
  starsImageSrc,
  date,
  reviewText,
  hasBorder = false,
}: ReviewCardProps) {
  const borderClass = hasBorder ? "border border-solid border-zinc-100" : "";

  return (
    <article
      className={`flex flex-col p-4 w-full rounded-lg bg-stone-50 ${borderClass} max-md:max-w-full`}
    >
      <header className="self-start text-sm">
        <h3 className="font-bold text-zinc-900">{reviewerName}</h3>
        <p className="mt-1 text-base text-zinc-600">{serviceType}</p>
        <div className="flex gap-2 items-center mt-1 text-zinc-500">
          <img
            src={starsImageSrc}
            alt="Star rating"
            className="object-contain shrink-0 self-stretch my-auto aspect-[5] w-[120px]"
          />
          <time className="self-stretch my-auto text-zinc-500">{date}</time>
        </div>
      </header>
      <p className="mt-2 text-base text-zinc-900 max-md:max-w-full">
        {reviewText}
      </p>
    </article>
  );
}
