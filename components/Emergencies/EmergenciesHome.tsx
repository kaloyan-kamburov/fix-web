"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import CategoriesList from "@/components/Categories/CategoriesList";

type Item = {
  id: number;
  name: string;
  picture: string;
  price: string | null;
  currency: string;
  secondPrice: string | null;
  secondCurrency: string;
};

export default function EmergenciesHome({ items }: { items: Item[] }) {
  const t = useTranslations();
  return (
    <section className="flex flex-col justify-center pb-10 text-base font-semibold text-center bg-gray-10 text-zinc-900 pt-[130px] max-md:pt-[76px] mx-auto">
      <div className="mx-auto w-full max-w-[960px]">
        <div className="flex relative gap-6 items-center p-5 bg-white rounded-lg border border-[var(--color-brand-red)] border-solid max-w-[400px] max-md:gap-5 max-md:p-5 max-sm:flex-col max-sm:gap-4 max-sm:items-center max-sm:p-4 max-sm:text-center">
          <Image
            src="/siren.webp"
            alt="siren"
            width={64}
            height={64}
            className="shrink-0"
          />
          <section className="flex relative flex-col gap-4 items-start w-[265px] max-md:flex-1 max-md:w-auto max-sm:gap-3 max-sm:items-center max-sm:w-full">
            <span className="text-lg font-bold text-zinc-900 max-sm:text-base text-left">
              {t("forEmegencySituations")}
            </span>
            <div className="flex relative gap-4 items-center self-stretch">
              <p className="relative text-base font-semibold text-center text-black max-md:text-base max-sm:text-sm">
                <span className="text-base font-bold text-black max-md:text-base max-sm:text-sm">
                  +359 89 030 892
                </span>
              </p>
            </div>
          </section>
        </div>
      </div>
      <CategoriesList
        title={t("emergencyServices")}
        items={items}
        isEmergencyList
      />
      <div className="box-border flex flex-col gap-20 items-center px-5 pt-16 pb-28 mx-auto my-0 w-full max-md:mt-0 mt-[100px]  bg-gray-10 max-w-[1110px] ">
        <div className="box-border flex items-center px-16 py-0 w-full bg-zinc-200 h-[330px] rounded-[40px] max-md:flex-col max-md:gap-8 max-md:p-8 max-md:h-auto max-md:min-h-[280px] max-sm:p-6 max-sm:h-auto max-sm:rounded-3xl max-sm:min-h-[auto]">
          <div className="flex flex-col gap-6 items-start flex-[1_0_0] max-md:items-center max-md:w-full max-md:text-center max-sm:gap-5">
            <h5 className="text-5xl font-bold text-zinc-900 leading-normal max-md:w-full max-md:text-4xl max-sm:text-2xl max-sm:leading-tight text-left max-md:text-center">
              {t("sendRequestDescription")}
            </h5>
            <button className="flex gap-2 justify-center items-center px-6 py-3 rounded-lg border border-solid transition-all cursor-pointer bg-stone-50 border-zinc-400 duration-[0.2s] ease-[ease] max-sm:px-7 max-sm:py-3.5 max-sm:w-full hover:bg-gray-10">
              <span className="text-base font-semibold text-center text-zinc-900 max-sm:text-base">
                <span className="text-base font-bold text-zinc-900">
                  {t("sendRequest")}
                </span>
              </span>
            </button>
          </div>
          <Image
            src="/home_handyman_1.webp"
            alt="home handyman"
            width={330}
            height={398}
            sizes="(max-width: 768px) 100vw, 330px"
            className="object-cover w-[330px] h-[398px] max-md:w-full max-md:h-auto"
          />
        </div>
      </div>
    </section>
  );
}
