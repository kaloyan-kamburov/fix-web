"use client";

import React from "react";
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
import Image from "next/image";
import { api } from "@/lib/api";

const emailSchema = z.object({
  email: z.string().min(1, "Задължително поле").email("Невалиден имейл"),
});

type ForgotFormData = z.input<typeof emailSchema>;

export default function ForgotPassword() {
  const [email, setEmail] = React.useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const [sent, setSent] = React.useState(false);

  const onSubmit: SubmitHandler<ForgotFormData> = async (data) => {
    try {
      await api.post("client/request-password-reset", { email: data.email });
      setSent(true);
      setEmail(data.email);
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
                Забравена парола
              </h1>
            </div>
          </header>

          {sent ? (
            <div className="flex flex-col items-center gap-4 w-full py-8">
              <Image
                src="/success.webp"
                alt="Success"
                width={560}
                height={560}
                className="object-contain success-img w-full max-w-[560px]"
              />
              <section className="relative self-stretch text-lg text-center text-zinc-600">
                <p className="text-lg text-zinc-600">
                  Изпратихме линк за верификация на{" "}
                  <span className="font-bold">{email}</span>
                </p>
              </section>
            </div>
          ) : (
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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-6 py-3 w-full bg-accentaccent rounded-lg h-auto hover:bg-accentaccent/90 cursor-pointer"
              >
                <span className="font-button font-[number:var(--button-font-weight)] text-gray-100 text-[length:var(--button-font-size)] text-center tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)]">
                  {isSubmitting ? "Моля, изчакайте..." : "Изпрати линк"}
                </span>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
