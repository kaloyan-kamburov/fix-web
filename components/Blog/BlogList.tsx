import * as React from "react";
import Image from "next/image";
import Link from "next/link";

export type BlogItem = {
  id: number;
  title: string;
  content?: string;
  excerpt?: string;
  picture?: string;
  slug?: string;
  publishedAt?: string;
  author?: string;
};

export default function BlogList({
  items,
  title,
  t,
}: {
  items: BlogItem[];
  title?: string;
  t: (key: string) => string;
}) {
  return (
    <>
      {/* Title section */}
      <section className="box-border flex relative flex-col gap-2 items-center justify-center py-8 w-full bg-gray-10 max-w-[1440px] mx-auto px-4">
        <h1 className="text-[24px] font-bold">{title || t("blog")}</h1>
      </section>

      {/* Grid: 2 per row on mobile, 4 per row on large screens */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-stretch px-40 mt-2 w-full tracking-wide max-md:px-5 max-md:max-w-full">
        {items.length === 0 && (
          <div className="col-span-2 lg:col-span-4 justify-self-center flex items-center justify-center text-zinc-500 text-center">
            {t("noResults")}
          </div>
        )}
        {items.map(
          ({ id, title, picture, slug, excerpt, publishedAt, author }) => (
            <Link
              href={`./blog/${slug || id}`}
              key={id}
              className="flex relative flex-col rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            >
              {picture ? (
                <div className="relative w-full h-32 md:h-40">
                  <Image
                    src={picture}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                    className="object-cover rounded-xl"
                  />
                </div>
              ) : (
                <div className="w-full h-32 md:h-40 bg-gray-200 rounded-xl" />
              )}
              <div className="flex relative flex-col gap-2 justify-center items-center self-stretch p-3">
                <h3 className="relative self-stretch text-base font-semibold tracking-wide text-center text-zinc-900 max-md:text-base max-sm:text-sm">
                  <span className="text-base font-bold text-zinc-900 max-md:text-base max-sm:text-sm">
                    {title}
                  </span>
                </h3>
                {publishedAt && (
                  <p className="text-xs text-zinc-500 text-center">
                    {new Date(publishedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </Link>
          )
        )}
      </div>
    </>
  );
}
