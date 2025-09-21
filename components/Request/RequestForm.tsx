"use client";
import * as React from "react";
import { ImageUpload } from "@/components/Form/ImageUpload";
import { TimeSlotButton } from "../Form/TimeSlotButton";
import { Input } from "../Form/Input";
import { MapView } from "./MapView";
import { Label } from "@/components/Form/Label";
import { QuantitySelector } from "@/components/Request/QuantitySelector";
import { useTranslations } from "next-intl";

export default function RequestForm({
  serviceId,
  locale,
  pricePrimary,
  priceSecondary,
  currency,
  currency2,
}: {
  serviceId: string;
  locale: string;
  pricePrimary?: string | null;
  priceSecondary?: string | null;
  currency?: string;
  currency2?: string;
}) {
  const t = useTranslations();
  const [files, setFiles] = React.useState<File[]>([]);
  const [phone, setPhone] = React.useState("");
  const [city, setCity] = React.useState("");
  const [district, setDistrict] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [quantity, setQuantity] = React.useState<number>(1);
  const [timeframe, setTimeframe] = React.useState<{
    start_time: string;
    end_time: string;
  } | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles(list);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: submit logic
    // console.log({ serviceId, locale, phone, city, district, address, comment, quantity, files });
  };

  return (
    <form
      className="flex flex-col gap-4 items-start self-stretch max-sm:gap-3 bg-gray-00 mt-[24px] text-gray-70"
      onSubmit={handleSubmit}
    >
      <ImageUpload onChange={onChange} />
      {/* removed files selected text */}

      <section className="flex flex-col gap-2 justify-center items-start">
        <h3 className="text-base text-zinc-400 ">
          {t("priceForOneTimeService")}
        </h3>
        {pricePrimary || priceSecondary ? (
          <p className="text-lg font-bold text-zinc-900 max-md:text-base max-sm:text-base">
            {pricePrimary ? (
              <>
                {pricePrimary} {currency || ""}
              </>
            ) : null}
            {priceSecondary ? (
              <>
                {pricePrimary ? " " : ""}({priceSecondary} {currency2 || ""})
              </>
            ) : null}
          </p>
        ) : null}
      </section>

      <section className="flex flex-col gap-2 items-start self-stretch">
        <h3 className="text-base text-zinc-600">{t("timeRange")}</h3>
        {/* <p className="text-sm text-center text-black">
          {t("youCanChooseMoreThanOneOption")}
        </p> */}
        <TimeSlotButton
          onClick={() => {}}
          onSelect={(tf) => setTimeframe(tf)}
          selected={timeframe}
        />

        <div className="flex flex-col gap-0.5 items-start self-stretch mt-[16px]">
          <div className="flex gap-2 items-center self-stretch ">
            <Label
              htmlFor="phone"
              className="text-xs font-semibold text-zinc-900"
            >
              {t("phone")}*
            </Label>
          </div>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("phonePlaceholder")}
            className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
          />
        </div>

        <div className="flex flex-col gap-0.5 items-start self-stretch mt-[16px]">
          <div className="flex gap-2 items-center self-stretch">
            <Label
              htmlFor="city"
              className="text-xs font-semibold text-zinc-900"
            >
              {t("city")}*
            </Label>
          </div>
          <Input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t("cityPlaceholder")}
            className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
          />
        </div>

        <div className="flex flex-col gap-0.5 items-start self-stretch mt-[16px]">
          <div className="flex gap-2 items-center self-stretch">
            <Label
              htmlFor="district"
              className="text-xs font-semibold text-zinc-900"
            >
              {t("district")}*
            </Label>
          </div>
          <Input
            id="district"
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder={t("districtPlaceholder")}
            className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
          />
        </div>

        <div className="flex gap-3 items-start self-stretch max-sm:flex-col max-sm:gap-3 mt-[16px]">
          <div className="flex flex-col gap-0.5 items-start self-stretch flex-[1_0_0] max-sm:flex-none max-sm:self-stretch">
            <div className="flex gap-2 items-center self-stretch">
              <Label
                htmlFor="address"
                className="text-xs font-semibold text-zinc-900"
              >
                {t("address")}*
              </Label>
            </div>
            <Input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("addressPlaceholder")}
              className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
            />
          </div>
        </div>

        {/* <MapView /> */}

        <div className="flex flex-col gap-0.5 items-start self-stretch mt-[16px]">
          <div className="flex gap-2 items-center self-stretch">
            <label className="text-xs font-semibold text-zinc-900">
              {t("comment")}
            </label>
          </div>
          <div className="self-stretch w-full bg-gray-20 rounded-lg border border-solid border-[#dadade]">
            <div className="flex items-start p-2">
              <textarea
                id="comment"
                className="overflow-hidden text-sm leading-6 flex-[1_0_0] text-ellipsis text-zinc-900 bg-transparent border-none outline-none resize-none w-full h-full"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t("haveYouGotAdditionalNotes")}
              />
            </div>
          </div>
        </div>

        <div className="mt-[16px]">
          <QuantitySelector value={quantity} onChange={setQuantity} />
        </div>

        <div className="flex flex-col gap-4 justify-center items-center self-stretch mt-[16px]">
          <button
            type="submit"
            className="flex gap-2 justify-center items-center self-stretch px-6 py-3 bg-amber-200 rounded-lg cursor-pointer max-md:px-5 max-md:py-2.5 max-sm:px-4 max-sm:py-2 hover:bg-amber-300 transition-colors"
          >
            <span className="text-base font-semibold text-center text-zinc-900 max-md:text-base max-sm:text-sm">
              {t("sendRequest")}
            </span>
          </button>
        </div>
      </section>
    </form>
  );
}
