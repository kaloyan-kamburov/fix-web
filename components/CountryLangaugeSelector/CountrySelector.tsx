import React from "react";
import { CountryOption } from "./CountryOption";
import { useTranslations } from "next-intl";

export type CountryItem = {
  id: number;
  name: string;
  code: string; // ISO-2 uppercase
  flag: string;
};

export const CountrySelector: React.FC<{
  countries: CountryItem[];
  selectedCode?: string | null;
  onSelect?: (country: CountryItem) => void;
}> = ({ countries, selectedCode, onSelect }) => {
  const t = useTranslations();
  return (
    <section className="flex flex-col justify-center w-full max-md:max-w-full">
      <h2 className="self-center text-2xl font-bold text-zinc-900">
        {t("chooseCountry")}
      </h2>
      <div className="mt-5 w-full text-base font-semibold tracking-wide max-md:max-w-full  max-h-[350px] overflow-y-auto pt-[5px] pb-[5px]">
        {countries.map((c) => (
          <div className="mt-3 first:mt-0" key={c.code}>
            <CountryOption
              flagSrc={c.flag}
              countryName={c.name}
              selected={selectedCode?.toUpperCase() === c.code}
              onClick={() => onSelect?.(c)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
