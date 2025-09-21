"use client";

import React, { Suspense } from "react";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/Form/Input";
import { Label } from "@/components/Form/Label";
import { Logo } from "@/components/Logo/Logo.component";
import Link from "next/link";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";

const schema = z
  .object({
    password: z.string().min(6, "Минимум 6 символа"),
    confirm_password: z.string().min(6, "Минимум 6 символа"),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Паролите не съвпадат",
    path: ["confirm_password"],
  });

type ResetFormData = z.input<typeof schema>;

function ResetPasswordContent() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const email = params.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm_password: "" },
  });

  const [sent, setSent] = React.useState(false);

  const onSubmit: SubmitHandler<ResetFormData> = async (data) => {
    try {
      await api.post("client/reset-password", {
        email,
        password: data.password,
        token,
      });
      setSent(true);
    } catch (err) {
      // handled globally
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center gap-8 bg-gray-10 md:bg-gray-10 px-0 md:px-4 py-8 w-full">
      <Logo
        className="hidden md:block"
        style={{ width: "92px", height: "40px" }}
      />

      <Card className="w-full md:w-[720px] bg-gray-10 rounded-2xl border-0 shadow-none">
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
                Нова парола
              </h1>
            </div>
          </header>

          {sent ? (
            <div className="flex flex-col items-center gap-4 w-full py-8">
              <p className="text-center text-gray-100 text-base">
                Паролата ви беше променена успешно. Вече може да влезете.
              </p>
              <Link href="/login" className="underline text-gray-100">
                Към вход
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-end gap-6 w-full"
            >
              <div className="flex flex-col items-start gap-0.5 w-full">
                <div className="flex items-center gap-2 w-full">
                  <Label className="[font-family:'Open_Sans',Helvetica] font-semibold text-gray-100 text-xs tracking-[0] leading-[normal]">
                    Парола*
                  </Label>
                </div>
                <Input
                  className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-start gap-0.5 w-full">
                <div className="flex items-center gap-2 w-full">
                  <Label className="[font-family:'Open_Sans',Helvetica] font-semibold text-gray-100 text-xs tracking-[0] leading-[normal]">
                    Потвърди парола*
                  </Label>
                </div>
                <Input
                  className="w-full bg-gray-20 rounded-lg border border-solid border-[#dadade] p-2 h-auto"
                  type="password"
                  {...register("confirm_password")}
                />
                {errors.confirm_password && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.confirm_password.message}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-6 py-3 w-full bg-accentaccent rounded-lg h-auto hover:bg-accentaccent/90 cursor-pointer"
              >
                <span className="font-button font-[number:var(--button-font-weight)] text-gray-100 text-[length:var(--button-font-size)] text-center tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)]">
                  {isSubmitting ? "Моля, изчакайте..." : "Смени паролата"}
                </span>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
