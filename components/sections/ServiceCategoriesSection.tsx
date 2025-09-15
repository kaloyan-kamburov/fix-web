"use client";
import React, { useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const ServiceCategoriesSection = () => {
  const t = useTranslations();

  const serviceCategories = [
    {
      id: 1,
      title: t("serviceCategoriesTitle1"),
      image: "/slider-1.webp",
      height: "h-[226px]",
    },
    {
      id: 2,
      title: t("serviceCategoriesTitle2"),
      image: "/slider-2.jpg",
      height: "h-[226px]",
    },
    {
      id: 3,
      title: t("serviceCategoriesTitle3"),
      image: "/slider-3.jpg",
      height: "h-[248px]",
    },
    {
      id: 4,
      title: t("serviceCategoriesTitle4"),
      image: "/slider-4.jpg",
      height: "h-[248px]",
    },
  ];
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      containScroll: false,
      dragFree: true,
      skipSnaps: false,
    },
    [Autoplay({ delay: 2000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="flex flex-col items-center justify-center gap-8 pt-[60px] lg:pt-28 pb-20 px-0 w-full bg-gray-100">
      <header className="flex items-center justify-center gap-2 w-full">
        <h2 className="w-fit mt-[-1.00px] font-bold text-gray-00 text-[28px] lg:text-[40px] text-center leading-[normal] tracking-[0] px-[16px]">
          {t("serviceCategoriesTitle")}
        </h2>
      </header>

      <div className="w-full max-w-[1440px] mx-auto px-[16px] lg:px-16 relative">
        <div className="hidden md:block">
          {/* Left Arrow */}
          <button
            onClick={scrollPrev}
            className="cursor-pointer absolute left-20 top-1/2 transform -translate-y-1/2 mt-[-20px] z-10 hover:opacity-80 transition-opacity"
            aria-label="Previous slide"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: "scaleX(-1)" }}
            >
              <rect
                width="40"
                height="40"
                rx="20"
                transform="matrix(-1 0 0 1 40 0)"
                fill="#F9F9F9"
              />
              <path
                d="M13.8248 12.35L16.1748 10L26.1748 20L16.1748 30L13.8248 27.65L21.4581 20L13.8248 12.35Z"
                fill="#1C1C1D"
              />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollNext}
            className="cursor-pointer absolute right-20 top-1/2 transform mt-[-20px] -translate-y-1/2 z-10 hover:opacity-80 transition-opacity"
            aria-label="Next slide"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="40"
                height="40"
                rx="20"
                transform="matrix(-1 0 0 1 40 0)"
                fill="#F9F9F9"
              />
              <path
                d="M13.8248 12.35L16.1748 10L26.1748 20L16.1748 30L13.8248 27.65L21.4581 20L13.8248 12.35Z"
                fill="#1C1C1D"
              />
            </svg>
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-10 pl-10 pr-10">
              {[
                ...serviceCategories,
                ...serviceCategories,
                ...serviceCategories,
              ].map((category, index) => (
                <div
                  key={`${category.id}-${index}`}
                  className={`flex-shrink-0 w-[254px] ${category.height}`}
                >
                  <Card className="flex flex-col w-full h-full items-center justify-center gap-2 rounded-lg overflow-hidden bg-transparent border-none shadow-none">
                    <CardContent className="p-0 w-full h-full flex flex-col gap-2">
                      <div className="relative w-full h-48 rounded-md overflow-hidden">
                        <Image
                          src={category.image}
                          alt={category.title}
                          width={254}
                          height={192}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex flex-col items-center justify-center gap-2 pt-0 pb-1 px-0 w-full">
                        <h3 className="mt-[-1.00px] font-h3 font-[number:var(--h3-font-weight)] text-gray-00 text-[length:var(--h3-font-size)] text-center tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] [font-style:var(--h3-font-style)]">
                          {category.title}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-4 align-center">
            {serviceCategories.map((category) => (
              <div key={category.id} className="flex flex-col gap-2">
                <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-[-1.00px] font-h3 font-[number:var(--h3-font-weight)] text-gray-00 text-[length:var(--h3-font-size)] text-center tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] [font-style:var(--h3-font-style)]">
                  {category.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link
        href="/services"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accentaccent rounded-lg h-auto hover:bg-accentaccent/90"
      >
        <span className="w-fit mt-[-1.00px] font-button font-[number:var(--button-font-weight)] text-gray-100 text-[length:var(--button-font-size)] text-center tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)]">
          {t("serviceCategoriesButton")}
        </span>
      </Link>
    </section>
  );
};
