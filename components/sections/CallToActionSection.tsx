"use client";

import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export const CallToActionSection = () => {
  const t = useTranslations();
  return (
    <section className=" pb-0 px-0 flex flex-col w-full items-center gap-20 relative bg-gray-100 shadow-[0px_4px_4px_#00000040] pt-[16px]  lg:pt-[100px]">
      <div className="flex h-auto lg:h-[342px] items-end justify-center gap-0 lg:gap-[38px] pl-[16px] lg:pl-0 pr-[16px] lg:pr-0 lg:pr-5 py-0 relative w-full bg-[linear-gradient(90deg,rgba(28,28,29,0)_0%,rgba(14,13,13,1)_100%)] flex-col lg:flex-row">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between">
          <div className="flex flex-col w-full lg:w-1/2 max-w-[617px] px-[16px] items-start lg:gap-6 px-0 py-[16px] lg:pt-16 relative flex-1 grow mt-0 lg:mt-[-13.00px] mx-auto lg:mx-0">
            <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto]">
              <h1 className="relative self-stretch mt-[-1.00px] font-bold text-gray-00 tracking-[0]  text-[32px] lg:text-[40px] leading-[normal] lg:leading-[50px]">
                {t("callToActionTitle")}
              </h1>

              <p className="relative self-stretch font-normal text-gray-20 text-xl tracking-[0] leading-[normal] text-[20px]">
                {t("callToActionDescription")}
              </p>
            </div>

            <div className="inline-flex items-end gap-5 relative  hidden lg:flex-[0_0_auto]">
              <div className="flex-col items-start inline-flex justify-center gap-2 relative flex-[0_0_auto]">
                <div className="w-fit mt-[-1.00px] font-normal text-gray-20 text-lg leading-[normal] relative tracking-[0] hidden md:block">
                  {t("callToActionButton")}
                </div>

                <div className="flex w-[330px] items-center gap-3 relative flex-[0_0_auto] hidden lg:flex">
                  <Link
                    href="https://apps.apple.com/app/fix/id6502918136"
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
                    href="https://play.google.com/store/apps/details?id=eu.fixapp"
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
              </div>

              <div className="flex flex-col w-[34px] items-center justify-center gap-2 relative hidden lg:block">
                <div className="self-stretch mt-[-1.00px] font-normal text-white text-lg leading-[50px] relative tracking-[0]">
                  {t("callToActionOr")}
                </div>
              </div>

              <div className="hidden lg:inline-flex items-start justify-center gap-4 flex-col relative  ">
                <Link
                  href="#contact"
                  className="h-auto inline-flex items-center justify-center gap-2 px-6 py-3 relative flex-[0_0_auto] rounded-lg border border-solid border-gray-40 shadow-[0px_0px_12px_#00000040] bg-transparent hover:border-accentaccent hover:text-accentaccent transition-all duration-300"
                >
                  <span className="relative w-fit mt-[-1.00px] font-button font-[number:var(--button-font-weight)]  text-[length:var(--button-font-size)] text-center tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)] whitespace-nowrap">
                    {t("callToActionButtonHere")}
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className="relative w-1/2 max-w-[581px] h-[382px] mt-[-40.00px] rounded-lg hidden lg:block">
            <Image
              src="/phones.webp"
              alt="Phones"
              width={581}
              height={382}
              className="w-full h-full"
            />
          </div>
          <div className="block lg:hidden max-w-[200px] mx-auto pb-[16px]">
            <Image
              src="/cta-image-mobile.png"
              alt="Phones"
              width={581}
              height={382}
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="flex flex-col items-center flex py-[16px] gap-[16px] mx-auto lg:hidden">
          <div className="flex items-center gap-[16px]">
            <Link
              href="https://apps.apple.com/app/fix/id6502918136"
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
              href="https://play.google.com/store/apps/details?id=eu.fixapp"
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
          <Link
            href="#contact"
            className="h-auto inline-flex items-center justify-center gap-2 px-6 py-3 relative flex-[0_0_auto] rounded-lg border border-solid border-gray-40 shadow-[0px_0px_12px_#00000040] bg-transparent hover:border-accentaccent hover:text-accentaccent transition-all duration-300"
          >
            <span className="relative w-fit mt-[-1.00px] font-button font-[number:var(--button-font-weight)] text-gray-00 text-[length:var(--button-font-size)] text-center tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)]">
              {t("callToActionButtonHere")}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};
