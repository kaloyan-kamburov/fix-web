"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";

export const FeaturedServicesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      title: "Проверени професионалисти",
      description:
        "Всеки майстор в платформата е с проверени документи и рейтинг от клиенти",
      image: "/service-1.webp",
    },
    {
      title: "Прозрачни оферти",
      description: "Получаваш няколко предложения и избираш най-доброто",
      image: "/service-2.webp",
    },
    {
      title: "Гъвкаво планиране",
      description: "Ремонтите се случват, когато на теб ти е удобно",
      image: "/service-3.webp",
    },
    {
      title: "Сигурно плащане",
      description:
        "Парите са защитени и се освобождават само след приключване на услугата",
      image: "/service-4.webp",
    },
  ];

  // Auto-rotation effect (desktop only)
  useEffect(() => {
    const checkScreenSize = () => {
      return window.innerWidth >= 768; // md breakpoint
    };

    if (!checkScreenSize()) {
      return; // Don't start auto-rotation on mobile
    }

    const interval = setInterval(() => {
      if (checkScreenSize()) {
        setActiveIndex((prevIndex) => (prevIndex + 1) % features.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <section className="w-full p-4 md:p-0 md:pr-10 md:py-28 bg-gray-100">
      {/* Desktop Layout */}
      <div className="hidden md:flex w-full items-center gap-4 md:gap-10 pl-0 sm:mt-[16px] mt-0">
        <div className="flex-1 max-w-[760px] aspect-[760/551] rounded-[0px_24px_24px_0px] overflow-hidden">
          <Image
            src={features[activeIndex].image}
            alt="Service image"
            width={760}
            height={551}
            className="w-full h-full object-cover transition-all duration-300"
          />
        </div>

        <div className="flex flex-col items-start gap-3 flex-1">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`w-full rounded-2xl border-0 cursor-pointer transition-all duration-300 ${activeIndex === index ? 'bg-gray-90' : 'bg-gray-95'
                } hover:bg-gray-90`}
              onClick={() => setActiveIndex(index)}
            >
              <CardContent className="flex flex-col items-start justify-center gap-4 p-5">
                <h3 className="w-full font-bold text-gray-00 text-2xl leading-normal tracking-[0]">
                  {feature.title}
                </h3>
                <p className="w-full font-normal text-gray-00 text-lg leading-normal tracking-[0]">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden flex-col items-start gap-3 w-full">
        {features.map((feature, index) => (
          <Card
            key={index}
            className={`w-full rounded-2xl border-0 cursor-pointer transition-all duration-300 ${activeIndex === index ? 'bg-gray-90' : 'bg-gray-95'
              } hover:bg-gray-90`}
            onClick={() => setActiveIndex(index)}
          >
            <CardContent className="flex flex-col items-start justify-center gap-3 p-4">
              <h3 className="w-full font-bold text-gray-00 text-[20px] leading-normal tracking-[0]">
                {feature.title}
              </h3>
              <p className="w-full font-normal text-gray-00 text-[16px] leading-normal tracking-[0]">
                {feature.description}
              </p>
              {activeIndex === index && (
                <div className="w-full mt-3">
                  <Image
                    src={feature.image}
                    alt="Service image"
                    width={760}
                    height={400}
                    className="w-full h-auto object-cover rounded-lg transition-all duration-300"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
