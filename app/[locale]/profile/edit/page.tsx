"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import toast from "react-hot-toast";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/Form/Input";
import { Label } from "@/components/Form/Label";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const schema = z.object({
  first_name: z.string().min(1, "Задължително поле"),
  last_name: z.string().min(1, "Задължително поле"),
  email: z.string().email("Невалиден имейл"),
  phone: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  neighborhood: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof schema>;

export default function ProfileEditPage() {
  const t = useTranslations();
  const locale = useLocale();

  const [isLoading, setIsLoading] = React.useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("client/me");
        reset({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          city: res.data.city || "",
          neighborhood: res.data.neighborhood || "",
          address: res.data.address || "",
        });
      } catch (_) {}
      setIsLoading(false);
    };
    load();
  }, [reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      // Adjust endpoint if different in backend
      await api.put("client/profile", values);
      toast.success(t("updateSuccess"));
    } catch (_) {}
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 bg-gray-00 md:bg-gray-10 px-0 md:px-4 py-8 w-full">
      <Card className="w-full md:w-[720px] bg-gray-00 rounded-2xl border-0 shadow-none">
        <CardContent className="flex flex-col items-center gap-8 p-0 md:p-10">
          <header className="flex items-center w-full">
            <Link
              href={`/${locale}/profile`}
              aria-label={t("back")}
              className="w-6 h-6 inline-flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-gray-100"
              >
                <path d="m12 19-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex items-center justify-center gap-2 flex-1">
              <h1 className="font-h1 font-bold font-[number:var(--h1-font-weight)] text-gray-100 text-[length:var(--h1-font-size)] text-center tracking-[var(--h1-letter-spacing)] leading-[var(--h1-line-height)] [font-style:var(--h1-font-style)]">
                {t("editProfileClient")}
              </h1>
            </div>

            <div className="w-6 h-6" />
          </header>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-end gap-6 w-full"
          >
            <div className="flex flex-col items-start gap-0.5 w-full">
              <Label className="[font-family:'Open_Sans',Helvetica] font-semibold text-gray-100 text-xs tracking-[0] leading-[normal]">
                {t("userName")}
              </Label>
              <Input
                className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
                type="text"
                {...register("first_name")}
              />
              {errors.first_name && (
                <span className="text-red-500 text-xs mt-1">
                  {String(errors.first_name.message)}
                </span>
              )}
            </div>

            <div className="flex flex-col items-start gap-0.5 w-full">
              <Label className="[font-family:'Open_Sans',Helvetica] font-semibold text-gray-100 text-xs tracking-[0] leading-[normal]">
                {t("lastName")}
              </Label>
              <Input
                className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
                type="text"
                {...register("last_name")}
              />
              {errors.last_name && (
                <span className="text-red-500 text-xs mt-1">
                  {String(errors.last_name.message)}
                </span>
              )}
            </div>

            <div className="flex flex-col items-start gap-0.5 w-full">
              <Label className="[font-family:'Open_Sans',Helvetica] font-semibold text-gray-100 text-xs tracking-[0] leading-[normal]">
                {t("email")}
              </Label>
              <Input
                className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
                type="email"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {String(errors.email.message)}
                </span>
              )}
            </div>

            <div className="flex flex-col items-start gap-0.5 w-full">
              <Label className="[font-family:'Open_Sans',Helvetica] font-semibold text-gray-100 text-xs tracking-[0] leading-[normal]">
                {t("telephoneNumber")}
              </Label>
              <Input
                className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
                type="text"
                {...register("phone")}
              />
            </div>

            <div className="flex flex-col items-start gap-0.5 w-full">
              <Label className="[font-family:'Open_Sans',Helvetica] font-semibold text-gray-100 text-xs tracking-[0] leading-[normal]">
                {t("city")}
              </Label>
              <Input
                className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
                type="text"
                {...register("city")}
              />
            </div>

            <div className="flex flex-col items-start gap-0.5 w-full">
              <Label className="[font-family:'Open_Sans',Helvetica] font-semibold text-gray-100 text-xs tracking-[0] leading-[normal]">
                {t("neighbourhoodClient")}
              </Label>
              <Input
                className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
                type="text"
                {...register("neighborhood")}
              />
            </div>

            <div className="flex flex-col items-start gap-0.5 w-full">
              <Label className="[font-family:'Open_Sans',Helvetica] font-semibold text-gray-100 text-xs tracking-[0] leading-[normal]">
                {t("addressClient")}
              </Label>
              <Input
                className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
                type="text"
                {...register("address")}
              />
            </div>

            <div className="flex items-center justify-end gap-3 w-full">
              <Link
                href={`/${locale}/profile`}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent rounded-lg border border-solid border-[#dadade] hover:bg-gray-10 flex-1"
              >
                <span className="font-button text-gray-100">{t("cancel")}</span>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-6 py-3 w-fit bg-accentaccent rounded-lg h-auto hover:bg-accentaccent/90 flex-1 cursor-pointer"
              >
                <span className="font-button text-gray-100">
                  {isSubmitting ? t("pleaseWait") : t("saveChanges")}
                </span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
