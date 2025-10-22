"use client";

import React from "react";
import { z } from "zod";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/Form/Checkbox";
import { Input } from "@/components/Form/Input";
import { Label } from "@/components/Form/Label";
import { Logo } from "@/components/Logo/Logo.component";
import Link from "next/link";
import { api } from "@/lib/api";
import { getAuth, setAuth } from "@/lib/auth";
import {
  useRouter,
  usePathname,
  useSearchParams,
  useParams,
} from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const loginSchema = z.object({
  email: z.string().min(1, "Задължително поле").email("Невалиден имейл"),
  password: z.string().min(1, "Задължително поле"),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.input<typeof loginSchema>;

export default function Login() {
  const t = useTranslations();
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale } = useParams();

  const backHref = React.useMemo(() => {
    try {
      const parts = (pathname || "").split("/").filter(Boolean);
      // On this page, first segment is the locale which we treat as country segment for back URL
      const country = (parts[0] || "bg").toLowerCase();
      return `/${country}`;
    } catch {
      return "/bg-bg";
    }
  }, [pathname, searchParams]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  React.useEffect(() => {
    if (getAuth()) {
      router.push(backHref);
    }
  }, [router, backHref]);

  const onSubmit: SubmitHandler<LoginFormData> = async (formData) => {
    try {
      const res = await api.post("client/login", {
        email: formData.email,
        password: formData.password,
      });
      if (res.data?.user && res.data?.access_token) {
        setAuth({ user: res.data.user, accessToken: res.data.access_token });
        router.push(backHref);
      }
    } catch (err: unknown) {
      //   console.error(err);
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center gap-8 bg-gray-10 md:bg-gray-10 px-0 md:px-4 pt-[88px] pb-8 w-full">
      <Card className="w-full md:w-[720px] bg-gray-10 rounded-2xl border-0 shadow-none">
        <CardContent className="flex flex-col items-center gap-8 p-0 md:p-10">
          <header className="flex items-center w-full">
            <Link
              href={backHref}
              aria-label="Назад към вход"
              className="w-6 h-6 inline-flex items-center justify-center"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-100" />
            </Link>
            <div className="flex items-center justify-center gap-2 flex-1">
              <h1 className="font-h1 font-bold font-[number:var(--h1-font-weight)] text-gray-100 text-[length:var(--h1-font-size)] text-center tracking-[var(--h1-letter-spacing)] leading-[var(--h1-line-height)] [font-style:var(--h1-font-style)]">
                {t("login")}
              </h1>
            </div>

            <div className="w-6 h-6" />
          </header>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-end gap-6 w-full"
          >
            <div className="flex flex-col items-start gap-0.5 w-full">
              <div className="flex items-center gap-2 w-full">
                <Label className="[font-family:'Open_Sans',Helvetica] font-semibold text-gray-100 text-xs tracking-[0] leading-[normal]">
                  Имейл*
                </Label>
              </div>

              <Input
                className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
                type="email"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col items-start gap-4 w-full">
              <div className="flex flex-col items-start gap-0.5 w-full">
                <div className="flex items-center gap-2 w-full">
                  <Label className="[font-family:'Open_Sans',Helvetica] font-semibold text-gray-100 text-xs tracking-[0] leading-[normal]">
                    {t("password")}*
                  </Label>
                </div>

                <div className="relative w-full">
                  <Input
                    className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 pr-12 h-auto"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                  />

                  <div className="absolute right-0 top-0 h-full flex items-center">
                    <div className="flex w-10 items-center justify-center bg-transparent">
                      <button
                        type="button"
                        aria-label={
                          showPassword ? t("hidePassword") : t("showPassword")
                        }
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="inline-flex items-center justify-center h-full px-2 bg-transparent rounded-none border-l border-solid border-[#dadade] text-gray-100 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="w-6 h-6 text-gray-100" />
                        ) : (
                          <EyeIcon className="w-6 h-6 text-gray-100" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between w-full">
                {/* <div className="inline-flex items-center gap-1">
                  <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="remember-me"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                        className="w-6 h-6 rounded-sm border-[1.5px] border-solid border-[#808184] data-[state=checked]:bg-transparent data-[state=checked]:border-[#808184]"
                      />
                    )}
                  />
                  <Label
                    htmlFor="remember-me"
                    className="font-h3 font-[number:var(--h3-font-weight)] text-gray-100 text-[length:var(--h3-font-size)] text-center tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] [font-style:var(--h3-font-style)] cursor-pointer"
                  >
                    {t("rememberMe")}
                  </Label>
                </div> */}

                <Link
                  href={`/${locale}/forgot-password`}
                  className="font-h3 ml-auto font-[number:var(--h3-font-weight)] text-gray-100 text-[length:var(--h3-font-size)] text-center tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] [font-style:var(--h3-font-style)] bg-transparent border-none cursor-pointer hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3 w-full bg-accentaccent rounded-lg h-auto hover:bg-accentaccent/90 cursor-pointer"
            >
              <span className="font-button font-[number:var(--button-font-weight)] text-gray-100 text-[length:var(--button-font-size)] text-center tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)]">
                {t("login")}
              </span>
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="[font-family:'Open_Sans',Helvetica] font-normal text-base text-center leading-4">
        <span className="text-[#626366] tracking-[0]">{t("noAccount")}</span>
        <span className="text-[#626366] tracking-[0] leading-[0.1px]">
          &nbsp;
        </span>
        <Link
          href={`/${locale}/register`}
          className="font-[number:var(--h3-font-weight)] text-[#1b1b1c] tracking-[var(--h3-letter-spacing)] font-h3 [font-style:var(--h3-font-style)] leading-[var(--h3-line-height)] text-[length:var(--h3-font-size)] bg-transparent border-none cursor-pointer hover:underline"
        >
          {t("registration")}
        </Link>
      </div>
    </div>
  );
}
