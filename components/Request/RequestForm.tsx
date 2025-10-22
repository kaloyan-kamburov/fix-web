"use client";
import * as React from "react";
import { ImageUpload } from "@/components/Form/ImageUpload";
import { TimeSlotButton } from "../Form/TimeSlotButton";
import { Input } from "../Form/Input";
import { MapView } from "./MapView";
import { Label } from "@/components/Form/Label";
import { QuantitySelector } from "@/components/Request/QuantitySelector";
import { Select } from "@/components/Form/Select";
import { useTranslations } from "next-intl";
import { loadGoogleMaps } from "@/lib/maps";
import { api } from "@/lib/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "../Loader/Loader";
import Link from "next/link";
import Image from "next/image";
import "react-calendar/dist/Calendar.css";

export default function RequestForm({
  name,
  serviceId,
  locale,
  pricePrimary,
  priceSecondary,
  currency,
  currency2,
  categoryId,
  cities,
}: {
  name: string;
  serviceId: string;
  locale: string;
  pricePrimary?: string | null;
  priceSecondary?: string | null;
  currency?: string;
  currency2?: string;
  categoryId?: string;
  cities?: string[];
}) {
  const t = useTranslations();
  const [files, setFiles] = React.useState<File[]>([]);
  const schema = z.object({
    phone: z.string().min(1, t("requiredField")),
    city: z.string().optional(),
    neighbourhood: z.string().min(1, t("requiredField")),
    address: z.string().min(1, t("requiredField")),
    client_comment: z.string().min(1, t("requiredField")),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      phone: "",
      city: "",
      neighbourhood: "",
      address: "",
      client_comment: "",
    },
  });

  const [quantity, setQuantity] = React.useState<number>(1);
  const [timeframe, setTimeframe] = React.useState<{
    start_time: string;
    end_time: string;
  } | null>(null);
  const [clientIntervals, setClientIntervals] = React.useState<
    Array<{ date: string; start_time: string; end_time: string }>
  >([]);
  const [coords, setCoords] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const addressInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [showIntervalError, setShowIntervalError] = React.useState(false);
  const [showFieldErrors, setShowFieldErrors] = React.useState(false);

  const groupedIntervals = React.useMemo(() => {
    const byDate = new Map<
      string,
      Array<{ start_time: string; end_time: string }>
    >();
    for (const it of clientIntervals) {
      const d = String(it?.date || "");
      const st = String(it?.start_time || "");
      const et = String(it?.end_time || "");
      if (!d || !st || !et) continue;
      if (!byDate.has(d)) byDate.set(d, []);
      byDate.get(d)!.push({ start_time: st, end_time: et });
    }
    return Array.from(byDate.entries());
  }, [clientIntervals]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles(list);
  };

  const onSubmit = (values: FormValues) => {
    setShowFieldErrors(true);
    if (clientIntervals.length === 0) {
      setShowIntervalError(true);
      return;
    }
    (async () => {
      try {
        setIsSubmitting(true);
        setSuccess(false);
        const fd = new FormData();
        // Files
        files.forEach((file, idx) => {
          fd.append(`pictures_before[${idx}]`, file);
        });
        // Scalars
        if (values.phone) fd.append("phone", values.phone);
        // Client intervals (array)
        clientIntervals.forEach((it, idx) => {
          fd.append(`client_intervals[${idx}][date]`, it.date);
          fd.append(`client_intervals[${idx}][start_time]`, it.start_time);
          fd.append(`client_intervals[${idx}][end_time]`, it.end_time);
        });
        fd.append("service_id", serviceId);
        if (values.city) fd.append("city", values.city);
        if (values.address) fd.append("address", values.address);
        if (values.neighbourhood)
          fd.append("neighbourhood", values.neighbourhood);
        fd.append("country_region_id", "26");
        fd.append("quantity", String(quantity));
        if (coords?.lat != null) fd.append("latitude", String(coords.lat));
        if (coords?.lng != null) fd.append("longitude", String(coords.lng));

        await api.post("client/orders", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess(true);
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  React.useEffect(() => {
    let mounted = true;
    const initPlaces = async () => {
      try {
        await loadGoogleMaps(
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string | undefined
        );
        if (!mounted || !addressInputRef.current) return;
        const autocomplete = new window.google.maps.places.Autocomplete(
          addressInputRef.current,
          {
            fields: ["formatted_address", "geometry"],
            types: ["geocode"],
          }
        );
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place) return;
          if (place.formatted_address)
            setValue("address", place.formatted_address, {
              shouldValidate: true,
            });
          const loc = place.geometry?.location;
          if (loc) {
            const next = { lat: loc.lat(), lng: loc.lng() };
            setCoords(next);
          }
        });
      } catch {}
    };
    initPlaces();
    return () => {
      mounted = false;
    };
  }, []);

  // Capture address DOM node while preserving RHF ref
  const addressRegister = register("address");

  return !success ? (
    <>
      <h1 className="text-2xl font-bold text-zinc-900 max-md:text-2xl max-sm:text-xl text-left mt-4">
        {t("newRequest")}
      </h1>
      <h2 className="text-lg font-bold text-zinc-900 max-md:text-base max-sm:text-base text-left mt-[24px]">
        {name || ""}
      </h2>
      <form
        className="flex flex-col gap-4 items-start self-stretch max-sm:gap-3 bg-gray-00 mt-[24px] text-gray-70"
        onSubmit={rhfHandleSubmit(onSubmit, () => {
          setShowFieldErrors(true);
          setShowIntervalError(!timeframe);
        })}
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
          <h3 className="text-base text-zinc-400">{t("timeRange")}</h3>
          <p className="text-sm text-center text-black">
            {t("youCanChooseMoreThanOneOption")}
          </p>
          <TimeSlotButton
            onClick={() => {}}
            initialIntervals={clientIntervals}
            onSave={(intervals) => {
              setClientIntervals(intervals);
              setShowIntervalError(false);
            }}
          />
          {showIntervalError && clientIntervals.length === 0 && (
            <span className="text-red-500 text-xs mt-1">
              {t("chooseInterval")}
            </span>
          )}
          {groupedIntervals.map(([date, intervals]) => (
            <p key={date}>
              <b>{date}: </b>{" "}
              {intervals
                .map(
                  (interval) => `${interval.start_time} - ${interval.end_time}`
                )
                .join(", ")}
            </p>
          ))}

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
              {...register("phone")}
              placeholder={t("phonePlaceholder")}
              className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
            />
            {showFieldErrors && errors.phone && (
              <span className="text-red-500 text-xs mt-1">
                {errors.phone.message as string}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-0.5 items-start self-stretch mt-[16px]">
            {Array.isArray(cities) && cities.length > 0 ? (
              <Select
                label={t("city")}
                value={watch("city") || ""}
                options={cities}
                onChange={(val) =>
                  setValue("city", val, { shouldValidate: true })
                }
                placeholder={t("cityPlaceholder")}
              />
            ) : (
              <Input
                id="city"
                type="text"
                {...register("city")}
                placeholder={t("cityPlaceholder")}
                className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
              />
            )}
            {/* City is optional */}
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
              id="neighbourhood"
              type="text"
              {...register("neighbourhood")}
              placeholder={t("districtPlaceholder")}
              className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
            />
            {showFieldErrors && errors.neighbourhood && (
              <span className="text-red-500 text-xs mt-1">
                {errors.neighbourhood.message as string}
              </span>
            )}
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
                {...addressRegister}
                placeholder={t("addressPlaceholder")}
                className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
                autoComplete="off"
                ref={(el) => {
                  addressRegister.ref(el);
                  addressInputRef.current = el;
                }}
              />
              {showFieldErrors && errors.address && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.address.message as string}
                </span>
              )}
            </div>
          </div>

          <MapView
            lat={coords?.lat}
            lng={coords?.lng}
            onChange={(pos) => setCoords(pos)}
          />

          <div className="flex flex-col gap-0.5 items-start self-stretch mt-[16px]">
            <div className="flex gap-2 items-center self-stretch">
              <label className="text-xs font-semibold text-zinc-900">
                {t("comment")}*
              </label>
            </div>
            <div className="self-stretch w-full bg-gray-20 rounded-lg border border-solid border-[#dadade]">
              <div className="flex items-start p-2">
                <textarea
                  id="client_comment"
                  className="overflow-hidden text-sm leading-6 flex-[1_0_0] text-ellipsis text-zinc-900 bg-transparent border-none outline-none resize-none w-full h-full"
                  {...register("client_comment")}
                  placeholder={t("haveYouGotAdditionalNotes")}
                />
              </div>
            </div>
            {showFieldErrors && errors.client_comment && (
              <span className="text-red-500 text-xs mt-1">
                {errors.client_comment.message as string}
              </span>
            )}
          </div>

          <div className="mt-[16px]">
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </div>

          <div className="flex flex-col gap-4 justify-center items-center self-stretch mt-[16px]">
            <button
              type="submit"
              className="flex gap-2 justify-center items-center self-stretch px-6 py-3 bg-amber-200 rounded-lg cursor-pointer max-md:px-5 max-md:py-2.5 max-sm:px-4 max-sm:py-2 hover:bg-amber-300 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              <span className="text-base font-semibold text-center text-zinc-900 max-md:text-base max-sm:text-sm">
                {isSubmitting ? (
                  <Loader className="max-w-[24px] max-h-[24px]" />
                ) : (
                  t("sendRequest")
                )}
              </span>
            </button>
          </div>
        </section>
      </form>
    </>
  ) : (
    <div className="flex flex-col items-center self-stretch w-full py-10 max-md:px-5">
      <div className="overflow-hidden px-14 pt-6 w-full max-w-[560px] max-md:px-5">
        <Image
          src="/robot.webp"
          alt="Success confirmation illustration"
          width={560}
          height={560}
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-contain w-full aspect-[0.84] max-md:max-w-full"
        />
      </div>

      <div className="flex flex-col justify-center px-4 mt-4 max-w-full text-center w-[714px]">
        <h1 className="self-center text-4xl font-bold text-zinc-900 max-md:max-w-full">
          {t("successSentTitle")}
        </h1>
        <p className="mt-4 text-base text-zinc-600 max-md:max-w-full">
          {t("successSentDescription")}
        </p>
      </div>

      <div className="flex gap-4 justify-center items-center self-stretch mt-[16px]">
        <Link
          className="flex gap-2 justify-center items-center px-6 py-3 mt-4 max-w-full text-base font-semibold text-center whitespace-nowrap rounded-lg border border-solid bg-stone-50 border-zinc-400 text-zinc-900 w-[400px] max-md:px-5 hover:bg-stone-100 transition-colors"
          href={`/${locale}/categories/${categoryId}`}
          type="button"
        >
          <span className="self-stretch my-auto text-zinc-900">
            {t("backToServices")}
          </span>
        </Link>
        <button
          className="flex gap-2 justify-center items-center px-6 py-3 mt-4 max-w-full text-base font-semibold text-center whitespace-nowrap rounded-lg border border-solid bg-stone-50 border-zinc-400 text-zinc-900 w-[400px] max-md:px-5 hover:bg-stone-100 transition-colors"
          onClick={() => {
            setSuccess(false);
            reset();
            setClientIntervals([]);
          }}
          type="button"
        >
          <span className="self-stretch my-auto text-zinc-900">
            {t("newRequest")}
          </span>
        </button>
      </div>
    </div>
  );
}
