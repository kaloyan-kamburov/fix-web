import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import Link from "next/link";

const howItWorksSteps = [
  {
    image: "/frame-35126-1.svg",
    title: "Избор на услуга",
    description:
      "Избери услугата, от която имаш нужда или заяви индивидуална оферта",
    alignment: "left",
  },
  {
    image: "/frame-35126.svg",
    title: "Описание на проблема",
    description: "Опиши проблема и прикачи снимки, за да получиш точни оферти",
    alignment: "center",
  },
  {
    image: "/frame-35127.svg",
    title: "Избор на оферта и график",
    description: "Избери оферта и запази когато ти е удобно",
    alignment: "right",
  },
];

export const HeroBannerSection = () => {
  return (
    <section className="hero-banner-bg flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] pt-[112px] md:pt-[112px] pt-[80px] px-[16px]">
      <div
        className="flex h-auto md:h-[720px] items-center justify-center gap-16 pt-5 md:pt-20 md:pb-20 pb-2 md:pb-10 md:px-16 relative w-full max-w-[1440px] mx-auto"
      >
        <main className="flex flex-col items-start justify-center gap-5 flex-1 md:max-w-[55%] lg:mt-[-200px] mt-auto md:px-0 px-4">
          <h1 className="relative self-stretch mt-[-1.00px] font-normal text-transparent text-[48px] leading-[110%] md:text-[56px] md:leading-[56px] tracking-[0]">
            <span className="font-semibold text-white leading-[0.1px]">
              Намери майстор за минути -{" "}
            </span>

            <span className="font-semibold text-accentaccent leading-[61.6px] md:leading-[61.6px] leading-[52.8px]">
              без обаждания, без излишни усилия
            </span>
          </h1>

          <p className="w-full font-normal text-white text-lg md:text-lg text-base leading-[normal] relative tracking-[0]">
            Fix-App свързва дома и офиса ти с проверени професионалисти за всеки
            ремонт. Бързи оферти, прозрачни цени и удобен график – всичко от
            телефона ти.
          </p>

          <div className="inline-flex items-center gap-4 md:gap-4 gap-4 px-0 py-4 relative flex-[0_0_auto] mx-auto md:mx-0">
            <Link
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-36 h-12 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <Image
                src="/appStore.svg"
                alt="Download on the App Store"
                width={144}
                height={48}
                className="object-contain"
              />
            </Link>

            <Link
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[162px] h-12 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <Image
                src="/googlePlay.svg"
                alt="Get it on Google Play"
                width={162}
                height={48}
                className="object-contain"
              />
            </Link>
          </div>
        </main>

        <div className="flex-shrink-0 hidden md:block">
          <Image
            className="object-contain"
            alt="Phone mockup"
            src="/phone.webp"
            width={369}
            height={596}
            priority
          />
        </div>
      </div>

      <div className="bg-gray-90 rounded-3xl px-8 md:px-8 px-4 py-[24px] md:py-12 py-10 mx-auto w-full max-w-[1300px] relative z-10 mt-auto lg:mt-[-140px]">
        {/* Title */}
        <h2 className="text-gray-20 text-4xl md:text-4xl text-[28px] font-bold text-center md:mb-16 mb-[24px]">
          Как работи
        </h2>

        <div className="flex flex-col md:flex-row items-start justify-between gap-8 relative">
          <div className="flex-1 text-left">
            <div className="flex items-center justify-start mb-4">
              <div className="text-accentaccent text-8xl font-bold relative">1
                <div className="hidden xl:block absolute top-1/2 left-full transform -translate-y-1/2 pl-[40px]">
                  <svg width="450" height="12" viewBox="0 0 450 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M450 6L440 0.226497V11.7735L450 6ZM0.333496 6V7H5.91683V6V5H0.333496V6ZM17.0835 6V7H28.2502V6V5H17.0835V6ZM39.4168 6V7H50.5835V6V5H39.4168V6ZM61.7502 6V7H72.9168V6V5H61.7502V6ZM84.0835 6V7H95.2502V6V5H84.0835V6ZM106.417 6V7H117.583V6V5H106.417V6ZM128.75 6V7H139.917V6V5H128.75V6ZM151.083 6V7H162.25V6V5H151.083V6ZM173.417 6V7H184.584V6V5H173.417V6ZM195.75 6V7H206.917V6V5H195.75V6ZM218.084 6V7H229.25V6V5H218.084V6ZM240.417 6V7H251.584V6V5H240.417V6ZM262.75 6V7H273.917V6V5H262.75V6ZM285.084 6V7H296.25V6V5H285.084V6ZM307.417 6V7H318.584V6V5H307.417V6ZM329.75 6V7H340.917V6V5H329.75V6ZM352.083 6V7H363.25V6V5H352.083V6ZM374.417 6V7H385.584V6V5H374.417V6ZM396.75 6V7H407.917V6V5H396.75V6ZM419.25 6V7H430.417V6V5H419.25V6ZM441.583 6V7H452.75V6V5H441.583V6Z" fill="#959499" />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="text-gray-20 text-xl font-semibold mb-3">Избор на услуга</h3>
            <p className="text-gray-40 text-base leading-relaxed">
              Избери услугата, от която имаш нужда или заяви индивидуална оферта
            </p>
          </div>
          <div className="flex-1 text-left md:text-center">
            <div className="flex md:items-center items-start md:justify-center justify-start mb-4">
              <div className="text-accentaccent text-8xl font-bold relative">
                2
                <div className="hidden xl:block absolute top-1/2 left-full transform -translate-y-1/2 pl-[40px]">
                  <svg width="450" height="12" viewBox="0 0 450 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M450 6L440 0.226497V11.7735L450 6ZM0.333496 6V7H5.91683V6V5H0.333496V6ZM17.0835 6V7H28.2502V6V5H17.0835V6ZM39.4168 6V7H50.5835V6V5H39.4168V6ZM61.7502 6V7H72.9168V6V5H61.7502V6ZM84.0835 6V7H95.2502V6V5H84.0835V6ZM106.417 6V7H117.583V6V5H106.417V6ZM128.75 6V7H139.917V6V5H128.75V6ZM151.083 6V7H162.25V6V5H151.083V6ZM173.417 6V7H184.584V6V5H173.417V6ZM195.75 6V7H206.917V6V5H195.75V6ZM218.084 6V7H229.25V6V5H218.084V6ZM240.417 6V7H251.584V6V5H240.417V6ZM262.75 6V7H273.917V6V5H262.75V6ZM285.084 6V7H296.25V6V5H285.084V6ZM307.417 6V7H318.584V6V5H307.417V6ZM329.75 6V7H340.917V6V5H329.75V6ZM352.083 6V7H363.25V6V5H352.083V6ZM374.417 6V7H385.584V6V5H374.417V6ZM396.75 6V7H407.917V6V5H396.75V6ZM419.25 6V7H430.417V6V5H419.25V6ZM441.583 6V7H452.75V6V5H441.583V6Z" fill="#959499" />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="text-gray-20 text-xl font-semibold mb-3">Описание на проблема</h3>
            <p className="text-gray-40 text-base leading-relaxed">
              Опиши проблема и прикачи снимки, за да получиш точни оферти
            </p>
          </div>
          <div className="flex-1 text-right sm:text-right text-left">
            <div className="flex items-center md:justify-end justify-start mb-4">
              <div className="text-accentaccent text-8xl font-bold">
                3</div>
            </div>
            <h3 className="text-gray-20 text-xl font-semibold mb-3 text-left md:text-right">
              Избор на оферта и график
            </h3>
            <p className="text-gray-40 text-base leading-relaxed text-left md:text-right">
              Избери оферта и запази когато ти е удобно
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

