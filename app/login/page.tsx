"use client";

import React from "react";
import { z } from "zod";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/Form/Checkbox";
import { Input } from "@/components/Form/Input";
import { Label } from "@/components/Form/Label";
import { Logo } from "@/components/Logo/Logo.component";

const loginSchema = z.object({
  email: z.string().email("Невалиден имейл"),
  password: z.string().min(1, "Паролата е задължителна"),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.input<typeof loginSchema>;

export default function Login() {
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

  const onSubmit: SubmitHandler<LoginFormData> = async (_data) => {
    // intentionally left empty for now
  };

  return (
    <div className=" flex flex-col items-center justify-center gap-8 bg-gray-10 px-4 py-8">
      <Logo style={{ width: "92px", height: "40px" }} />

      <Card className="w-[720px] bg-gray-00 rounded-2xl border-0 shadow-none">
        <CardContent className="flex flex-col items-center gap-8 p-10">
          <header className="flex items-center w-full">
            <div className="flex items-center justify-center gap-2 flex-1">
              <h1 className="font-h1 font-bold font-[number:var(--h1-font-weight)] text-gray-100 text-[length:var(--h1-font-size)] text-center tracking-[var(--h1-letter-spacing)] leading-[var(--h1-line-height)] [font-style:var(--h1-font-style)]">
                Вход
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
                    Парола*
                  </Label>
                </div>

                <div className="relative w-full">
                  <Input
                    className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 pr-12 h-auto"
                    type="password"
                    {...register("password")}
                  />

                  <div className="absolute right-0 top-0 h-full flex items-center">
                    <div className="flex w-10 items-center justify-center gap-2 bg-gray-00">
                      <div className="inline-flex items-center justify-center gap-1 p-2 bg-gray-20 rounded-sm">
                        <EyeIcon className="w-6 h-6" />
                      </div>
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

                <button
                  type="button"
                  className="font-h3 font-[number:var(--h3-font-weight)] text-gray-100 text-[length:var(--h3-font-size)] text-center tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] [font-style:var(--h3-font-style)] bg-transparent border-none cursor-pointer hover:underline"
                >
                  Забравена парола?
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3 w-full bg-accentaccent rounded-lg h-auto hover:bg-accentaccent/90"
            >
              <span className="font-button font-[number:var(--button-font-weight)] text-gray-100 text-[length:var(--button-font-size)] text-center tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)]">
                {isSubmitting ? "Моля, изчакайте..." : "Вход"}
              </span>
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="[font-family:'Open_Sans',Helvetica] font-normal text-base text-center leading-4">
        <span className="text-[#626366] tracking-[0]">Нямате акаунт?</span>
        <span className="text-[#626366] tracking-[0] leading-[0.1px]">
          &nbsp;
        </span>
        <button
          type="button"
          className="font-[number:var(--h3-font-weight)] text-[#1b1b1c] tracking-[var(--h3-letter-spacing)] font-h3 [font-style:var(--h3-font-style)] leading-[var(--h3-line-height)] text-[length:var(--h3-font-size)] bg-transparent border-none cursor-pointer hover:underline"
        >
          Регистрация
        </button>
      </div>
    </div>
  );
}
