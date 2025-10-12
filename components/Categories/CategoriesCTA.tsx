"use client";

import { useTranslations } from "next-intl";

export default function CategoriesCTA() {
  const t = useTranslations();
  return (
    <div className="box-border flex flex-col gap-20 items-center px-5 pt-16 pb-28 mx-auto my-0 w-full max-md:mt-0 mt-[100px]  bg-gray-10 max-w-[1110px] ">
      <div className="box-border flex items-center px-16 py-0 w-full bg-zinc-200 h-[330px] rounded-[40px] max-md:flex-col max-md:gap-8 max-md:p-8 max-md:h-auto max-md:min-h-[280px] max-sm:p-6 max-sm:h-auto max-sm:rounded-3xl max-sm:min-h-[auto]">
        <div className="flex flex-col gap-6 items-start flex-[1_0_0] max-md:items-center max-md:w-full max-md:text-center max-sm:gap-5">
          <h5 className="text-5xl font-bold text-zinc-900 leading-normal max-md:w-full max-md:text-4xl max-sm:text-2xl max-sm:leading-tight text-left max-md:text-center">
            {t("sendRequestDescription")}
          </h5>
          <button className="flex gap-2 justify-center items-center px-6 py-3 rounded-lg border border-solid transition-all cursor-pointer bg-stone-50 border-zinc-400 duration-[0.2s] ease-[ease] max-sm:px-7 max-sm:py-3.5 max-sm:w-full  hover:bg-gray-10">
            <span className="text-base font-semibold text-center text-zinc-900 max-sm:text-base">
              <span className="text-base font-bold text-zinc-900">
                {t("sendRequest")}
              </span>
            </span>
          </button>
        </div>
        <img
          src="/home_handyman_1.webp"
          alt="home handyman"
          width={330}
          height={398}
          className="object-cover w-[330px] h-[398px] max-md:w-full max-md:h-auto"
        />
      </div>
    </div>
  );
}
