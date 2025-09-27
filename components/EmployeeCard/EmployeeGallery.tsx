"use client";
import React, { useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import FsLightbox from "fslightbox-react";

export default function EmployeeGallery({ images }: { images: string[] }) {
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      containScroll: false,
      dragFree: true,
      skipSnaps: false,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );
  const [toggler, setToggler] = useState(false);
  const [slide, setSlide] = useState(1);

  const openAt = (idx: number) => {
    setSlide(idx + 1);
    setToggler(!toggler);
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (safeImages.length === 0) {
    return (
      <div className="flex justify-center items-center w-full py-6">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-30 bg-gray-10">
          <Image
            src="/camera.webp"
            alt="camera"
            fill
            className="object-contain p-3"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="hidden md:block relative">
        <button
          onClick={scrollPrev}
          className="cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 z-10 hover:opacity-80 transition-opacity"
          aria-label="Previous"
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
              fill="#f9f9f9"
            />
            <path
              d="M13.8248 12.35L16.1748 10L26.1748 20L16.1748 30L13.8248 27.65L21.4581 20L13.8248 12.35Z"
              fill="#1C1C1D"
            />
          </svg>
        </button>
        <button
          onClick={scrollNext}
          className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 z-10 hover:opacity-80 transition-opacity"
          aria-label="Next"
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
              fill="#f9f9f9"
            />
            <path
              d="M13.8248 12.35L16.1748 10L26.1748 20L16.1748 30L13.8248 27.65L21.4581 20L13.8248 12.35Z"
              fill="#1C1C1D"
            />
          </svg>
        </button>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 px-10">
            {safeImages.map((src, index) => (
              <div
                key={`${index}-${src}`}
                className="flex-shrink-0 w-[260px] h-[200px]"
              >
                <div
                  className="relative w-full h-full rounded-md overflow-hidden border border-gray-30 cursor-pointer hover:opacity-90"
                  onClick={() => openAt(index)}
                >
                  <Image
                    src={src}
                    alt={`Project ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 260px, 260px"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="grid grid-cols-2 gap-4">
          {safeImages.map((src, index) => (
            <div
              key={`${index}-m-${src}`}
              className="relative w-full aspect-[4/3] rounded-md overflow-hidden border border-gray-30 cursor-pointer"
              onClick={() => openAt(index)}
            >
              <Image
                src={src}
                alt={`Project ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <FsLightbox
        toggler={toggler}
        sources={safeImages}
        types={safeImages.map(() => "image")}
        slide={slide}
        onClose={() => setSlide(1)}
      />
    </div>
  );
}
