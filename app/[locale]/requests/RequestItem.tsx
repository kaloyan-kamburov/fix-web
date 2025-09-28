"use client";
import * as React from "react";
import { RequestBadge } from "./RequestBadge";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

interface RequestItemProps {
  id: string;
  image: string;
  title: string;
  date: string;
  time: string;
  price: string;
  quantity: string;
  offers?: string;
  isUrgent?: boolean;
  shouldHideOfferCount?: boolean;
}

export function RequestItem({
  id,
  image,
  title,
  date,
  time,
  price,
  quantity,
  offers,
  isUrgent,
  shouldHideOfferCount,
}: RequestItemProps) {
  const locale = useLocale();
  const t = useTranslations();
  return (
    <Link
      href={`/${locale}/requests/${id}`}
      className="flex flex-wrap gap-3 p-3 w-full rounded-lg bg-stone-50 max-md:max-w-full hover:bg-stone-100 transition-colors cursor-pointer"
    >
      {image ? (
        <Image
          src={image}
          alt={title}
          className="object-contain shrink-0 self-start rounded-lg aspect-square w-[104px]"
        />
      ) : (
        <div className="object-contain shrink-0 self-start rounded-lg aspect-square w-[104px]"></div>
      )}
      <div className="flex flex-col flex-1 shrink justify-between basis-0 min-w-60 max-md:max-w-full">
        <header className="flex flex-wrap gap-3 items-start w-full max-md:max-w-full">
          <div className="flex flex-col flex-1 shrink basis-0 min-w-60 text-neutral-700 max-md:max-w-full">
            <h3 className="text-lg font-bold text-neutral-700">{title}</h3>
            <div className="flex gap-2 items-center self-start mt-2 text-base">
              <time className="self-stretch my-auto text-neutral-700">
                {date}
              </time>
              <span className="self-stretch my-auto text-neutral-700">
                {time}
              </span>
            </div>
          </div>
          <div
            className={`text-sm text-zinc-900 w-[80px] flex flex-col gap-2 ${
              shouldHideOfferCount ? "hidden" : ""
            }`}
          >
            {offers && <RequestBadge text={offers} variant={"offers"} />}
            {isUrgent && <RequestBadge text={t("urgent")} variant="urgent" />}
          </div>
        </header>
        <footer className="flex gap-4 items-center self-start mt-7">
          <div className="flex gap-0.5 items-center self-stretch my-auto text-base font-semibold tracking-wide text-center text-zinc-900">
            <span className="self-stretch my-auto text-zinc-900">{price}</span>
          </div>
          <span className="self-stretch my-auto text-sm text-neutral-700">
            {quantity}
          </span>
        </footer>
      </div>
    </Link>
  );
}
