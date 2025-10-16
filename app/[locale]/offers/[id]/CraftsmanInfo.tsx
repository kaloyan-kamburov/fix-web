import * as React from "react";
import Image from "next/image";
import { Logo } from "@/components/Logo/Logo.component";
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
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt || name}
          width={80}
          height={80}
          className="w-20 h-20 border border-solid border-zinc-300 rounded-[200px] max-sm:h-[60px] max-sm:w-[60px] object-cover"
        />
      ) : (
        <div className="w-20 h-20 flex items-center justify-center border border-solid border-zinc-300 rounded-[200px] bg-white">
          <Logo color="#000000" style={{ width: 50, height: 50 }} />
        </div>
      )}
      <p className="text-sm font-bold text-zinc-900">{name}</p>
    </div>
  );
};
