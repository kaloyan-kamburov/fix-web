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
import { useRouter } from "next/navigation";

const emailRegex = /^[\w.+\-]+@([\w\-]+\.)+[A-Za-z]{2,}$/;

const registerSchema = z
  .object({
    first_name: z.string().min(1, "Задължително поле"),
    last_name: z.string().min(1, "Задължително поле"),
    email: z.string().regex(emailRegex, "Невалиден имейл"),
    password: z.string().min(1, "Задължително поле"),
    confirm_password: z.string().min(1, "Задължително поле"),
    phone: z.string().min(1, "Задължително поле"),
    rememberMe: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Паролите не съвпадат",
    path: ["confirm_password"],
  });

type RegisterFormData = z.input<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone: "",
      rememberMe: false,
    },
  });

  React.useEffect(() => {
    if (getAuth()) {
      router.push("/");
    }
  }, [router]);

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      const { data: res } = await api.post("register", {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      if (res?.user && res?.access_token) {
        setAuth({ user: res.user, accessToken: res.access_token });
        router.push("/");
      }
    } catch (err: unknown) {
      console.error(err);
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center gap-8 bg-gray-00 md:bg-gray-10 px-0 md:px-4 py-8 w-full">
      <Logo
        className="hidden md:block"
        style={{ width: "92px", height: "40px" }}
      />

      <Card className="w-full md:w-[720px] bg-gray-00 rounded-2xl border-0 shadow-none">
        <CardContent className="flex flex-col items-center gap-8 p-0 md:p-10">
          <header className="flex items-center w-full">
            <Link
              href="/login"
              aria-label="Назад към вход"
              className="w-6 h-6 inline-flex items-center justify-center"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-100" />
            </Link>
            <div className="flex items-center justify-center gap-2 flex-1">
              <h1 className="font-h1 font-bold font-[number:var(--h1-font-weight)] text-gray-100 text-[length:var(--h1-font-size)] text-center tracking-[var(--h1-letter-spacing)] leading-[var(--h1-line-height)] [font-style:var(--h1-font-style)]">
                Регистрация
              </h1>
            </div>
          </header>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-end gap-6 w-full"
          >
            {/* First name */}
            <div className="flex flex-col items-start gap-0.5 w-full">
              <div className="flex items-center gap-2 w-full">
                <Label className="[font-family:'Open_Sans',Helvetica] font-semibold text-gray-100 text-xs tracking-[0] leading-[normal]">
                  Име*
                </Label>
              </div>
              <Input
                className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
                type="text"
                {...register("first_name")}
              />
              {errors.first_name && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.first_name.message}
                </span>
              )}
            </div>

            {/* Last name */}
            <div className="flex flex-col items-start gap-0.5 w-full">
              <div className="flex items-center gap-2 w-full">
                <Label className="[font-family:'Open_Sans',Helvetica] font-semibold text-gray-100 text-xs tracking-[0] leading-[normal]">
                  Фамилия*
                </Label>
              </div>
              <Input
                className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
                type="text"
                {...register("last_name")}
              />
              {errors.last_name && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.last_name.message}
                </span>
              )}
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className="flex flex-col items-start gap-4 w-full">
              <div className="flex flex-col items-start gap-0.5 w-full">
                <div className="flex items-center gap-2 w-full">
                  <Label className="[font-family:'Open_Sans',Helvetica] font-semibold text-gray-100 text-xs tracking-[0] leading-[normal]">
                    Парола*
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
                          showPassword ? "Скрий паролата" : "Покажи паролата"
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
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col items-start gap-0.5 w-full">
                <div className="flex items-center gap-2 w-full">
                  <Label className="[font-family:'Open_Sans',Helvetica] font-semibold text-gray-100 text-xs tracking-[0] leading-[normal]">
                    Потвърди парола*
                  </Label>
                </div>
                <Input
                  className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
                  type={showPassword ? "text" : "password"}
                  {...register("confirm_password")}
                />
                {errors.confirm_password && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.confirm_password.message}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col items-start gap-0.5 w-full">
                <div className="flex items-center gap-2 w-full">
                  <Label className="[font-family:'Open_Sans',Helvetica] font-semibold text-gray-100 text-xs tracking-[0] leading-[normal]">
                    Телефон*
                  </Label>
                </div>
                <Input
                  className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
                  type="text"
                  {...register("phone")}
                />
                {errors.phone && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </span>
                )}
              </div>

              {/* Remember me and CTA */}
              <div className="flex items-center justify-between w-full">
                <div className="inline-flex items-center gap-1">
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
                    Запомни ме
                  </Label>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3 w-full bg-accentaccent rounded-lg h-auto hover:bg-accentaccent/90 cursor-pointer"
            >
              <span className="font-button font-[number:var(--button-font-weight)] text-gray-100 text-[length:var(--button-font-size)] text-center tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)]">
                {isSubmitting ? "Моля, изчакайте..." : "Регистрация"}
              </span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
