import * as React from "react";
import { useTranslations } from "next-intl";

interface CraftsmanInfoProps {
  name: string;
  imageUrl: string;
  imageAlt?: string;
  locale: string;
}

export const CraftsmanInfo: React.FC<CraftsmanInfoProps> = ({
  name,
  imageUrl,
  imageAlt = "",
  locale,
}) => {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-2 justify-center items-start self-stretch">
      <label className="font-normal text-zinc-600">{t("craftsman")}</label>
      <img
        src={imageUrl}
        alt={imageAlt}
        className="w-20 h-20 border border-solid border-zinc-300 rounded-[200px] max-sm:h-[60px] max-sm:w-[60px]"
      />
      <p className="text-sm font-bold text-zinc-900">{name}</p>
    </div>
  );
};
