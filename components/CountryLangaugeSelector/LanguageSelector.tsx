import React from "react";
import { LanguageOption } from "./LanguageOption";
import { useTranslations } from "next-intl";

export type LanguageItem = {
  name: string;
  code: string; // locale lowercase (e.g., en, de)
  flag: string;
};

export const LanguageSelector: React.FC<{
  languages: LanguageItem[];
  selectedCode?: string | null;
  onSelect?: (language: LanguageItem) => void;
}> = ({ languages, selectedCode, onSelect }) => {
  const t = useTranslations();
  return (
    <section className="flex flex-col mt-12 w-full text-base font-semibold max-md:mt-10 max-md:max-w-full">
      <h2 className="self-center text-2xl font-bold text-zinc-900">
        {t("chooseLanguage")}
      </h2>
      <div className="flex flex-wrap gap-5 items-start mt-5 tracking-wide whitespace-nowrap max-md:max-w-full justify-start">
        {languages.map((l) => (
          <LanguageOption
            key={l.code}
            flagSrc={l.flag}
            languageName={l.name}
            selected={selectedCode?.toLowerCase() === l.code.toLowerCase()}
            onClick={() => onSelect?.(l)}
          />
        ))}
      </div>
    </section>
  );
};
