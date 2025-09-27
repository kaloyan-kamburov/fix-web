"use client";
import { useEffect, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import Loader from "@/components/Loader/Loader";

export default function CheckoutForm({
  id,
  orderData,
}: {
  id: string;
  orderData: any;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const t = useTranslations();
  const locale = useLocale();

  const acceptOffer = async (paymentMethodId: string) => {
    const res = await api.post(`client/offers/${id}/accept`);
  };

  useEffect(() => {
    setIsSuccess(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setIsSuccess(false);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url:
            typeof window !== "undefined" ? window.location.href : undefined,
        },
      });
      if (paymentIntent?.status === "succeeded") {
        if (paymentIntent?.payment_method_types?.[0]) {
          // acceptOffer(paymentIntent?.payment_method_types?.[0]);
          acceptOffer("pm_card_visa");
        }
        setIsSuccess(true);
      }
    } catch (err) {
      toast.error("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return isSuccess ? (
    <div className="flex flex-col items-center self-stretch w-full max-md:px-5">
      <div className="overflow-hidden px-7 pt-6 w-full max-w-[360px] max-md:px-5">
        <Image
          src="/robot.webp"
          alt="Success confirmation illustration"
          width={360}
          height={360}
          sizes="(max-width: 768px) 100vw, 360px"
          className="object-contain w-full aspect-[0.84] max-md:max-w-full"
        />
      </div>

      <div className="flex flex-col justify-center px-4 mt-4 max-w-full text-center w-[714px]">
        <h1 className="self-center text-4xl font-bold text-zinc-900 max-md:max-w-full">
          {t("successPaymentTitle")}
        </h1>
        {/* <p className="mt-4 text-base text-zinc-600 max-md:max-w-full">
          {t("successSentDescription")}
        </p> */}
      </div>

      <div className="flex gap-4 justify-center items-center self-stretch mt-[16px]">
        <Link
          className="flex gap-2 justify-center items-center px-6 py-3 mt-4 max-w-full text-base font-semibold text-center whitespace-nowrap rounded-lg border border-solid bg-stone-50 border-zinc-400 text-zinc-900 w-[300px] max-md:px-5 hover:bg-stone-100 transition-colors"
          href={`/${locale}/requests#active`}
          type="button"
        >
          <span className="self-stretch my-auto text-zinc-900">
            {t("backToRequests")}
          </span>
        </Link>
      </div>
    </div>
  ) : (
    <>
      <h1 className="text-2xl font-bold text-zinc-900">
        {t("payNow")} {orderData?.amount}{" "}
        {`${orderData?.currency}`.toUpperCase()}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[480px] flex flex-col gap-4 mt-[40px]"
      >
        <PaymentElement options={{ layout: "tabs" }} />
        <button
          type="submit"
          disabled={!stripe || !elements || submitting}
          className="px-4 py-2 rounded-md bg-amber-200 text-zinc-900 font-bold disabled:opacity-50 disabled:cursor-default flex justify-center items-center"
        >
          {submitting ? (
            <Loader className="max-w-[24px] max-h-[24px]" />
          ) : (
            t("payNow")
          )}
        </button>
      </form>
    </>
  );
}
