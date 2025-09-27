"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { use, useEffect, useState } from "react";
import { api } from "@/lib/api";
import CheckoutForm from "./CheckoutForm";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import Link from "next/link";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

if (process.env.NEXT_PUBLIC_STRIPE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_KEY is not set");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = use(params);
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.post(`client/offers/${id}/payment-intent`);
        setClientSecret(res.data?.client_secret ?? null);
        setOrderData(res.data);

        // if (res.data.payment_method_configuration_details?.id) {
        //   acceptOffer(res.data.payment_method_configuration_details.id);
        // }
      } catch (e) {
        // toast.error(e.message || "Unexpected error. Please try again.", {
        //   duration: 5000,
        // });
        setTimeout(() => {
          router.push(`/${locale}/requests#sent`);
        }, 100);
        //redirect to the order page
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="bg-gray-10 w-full flex flex-1 flex-col">
      <section className="flex flex-col flex-1 justify-center pb-10 text-base font-semibold text-center bg-gray-10 text-zinc-900 pt-[88px] max-md:pt-[76px] mx-auto gap-4 h-full w-full max-w-[960px]">
        <div className="mx-auto w-full max-w-[1440px] w-full">
          <Link
            href={`/${locale}/offers/${id}`}
            className="flex relative gap-2 items-center self-stretch cursor-pointer max-sm:gap-1.5 w-fit mt-4"
            aria-label={t("back")}
          >
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 7.5H3.83L9.42 1.91L8 0.5L0 8.5L8 16.5L9.41 15.09L3.83 9.5H16V7.5Z"
                fill="#1C1C1D"
              />
            </svg>
            <div className="relative text-lg font-bold text-center text-zinc-900 max-md:text-base max-sm:text-sm">
              <div className="text-lg font-bold text-zinc-900 max-md:text-base max-sm:text-sm">
                {t("back")}
              </div>
            </div>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
          {loading ? (
            <div className="my-auto">
              <Loader />
            </div>
          ) : (
            clientSecret && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: { theme: "stripe" },
                    locale: "auto",
                  }}
                >
                  <CheckoutForm id={id} orderData={orderData} />
                </Elements>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
