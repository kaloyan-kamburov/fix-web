import { getTranslations } from "next-intl/server";
import { api } from "@/lib/api";
import Image from "next/image";
import CategoriesList from "@/components/Categories/CategoriesList";

const LOCALE_TO_ACCEPT_LANGUAGE: Record<string, string> = {
  bg: "bg-BG",
  en: "en-US",
  tr: "tr-TR",
  gr: "el-GR",
  nl: "nl-NL",
  swe: "sv-SE",
  por: "pt-PT",
  cr: "hr-HR",
  est: "et-EE",
  fin: "fi-FI",
  irl: "en-IE",
  lat: "lv-LV",
  lit: "lt-LT",
  lux: "lb-LU",
  mal: "mt-MT",
  slovakian: "sk-SK",
  slovenian: "sl-SI",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  es: "es-ES",
};

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  let data: unknown = null;
  let items: Array<{
    id: number;
    name: string;
    picture: string;
    price: string | null;
    currency: string;
    secondPrice: string | null;
    secondCurrency: string;
  }> = [];
  // [10, 17, 26, 41, 43, 55, 58, 59, 63, 65, 79, 81, 91, 97, 98, 104, 120, 137, 154, 155, 161]
  try {
    const res = await api.get("categories?filter[is_urgent]=true", {
      headers: {
        "X-Tenant-ID": 65,
      },
    });
    data = res.data;
    const root: any = data;
    const arr: any[] = Array.isArray(root)
      ? root
      : Array.isArray(root?.data)
      ? root.data
      : [];
    items = arr.map((c: any) => {
      const id = Number(c?.id ?? 0) || 0;
      const name = String(c?.name ?? "");
      const picture = String(c?.picture ?? "");
      const price = c?.price != null ? String(c.price) : null;
      const currency = String(c?.currency?.symbol || c?.currency?.code || "");
      const secondPrice =
        c?.price_second != null ? String(c.price_second) : null;
      const secondCurrency = String(
        c?.second_currency?.symbol || c?.second_currency?.code || ""
      );
      return {
        id,
        name,
        picture,
        price,
        currency,
        secondPrice,
        secondCurrency,
      };
    });
  } catch (_) {
    data = { error: true };
  }

  return (
    <section className="flex flex-col justify-center pb-10 text-base font-semibold text-center bg-gray-10 text-zinc-900 pt-[130px] max-md:pt-[76px] mx-auto">
      <CategoriesList title={t("emergencyCategories")} items={items} />
      <div className="box-border flex flex-col gap-20 items-center px-5 pt-16 pb-28 mx-auto my-0 w-full max-md:mt-0 mt-[100px]  bg-gray-10 max-w-[1110px] ">
        <div className="box-border flex items-center px-16 py-0 w-full bg-zinc-200 h-[330px] rounded-[40px] max-md:flex-col max-md:gap-8 max-md:p-8 max-md:h-auto max-md:min-h-[280px] max-sm:p-6 max-sm:h-auto max-sm:rounded-3xl max-sm:min-h-[auto]">
          <div className="flex flex-col gap-6 items-start flex-[1_0_0] max-md:items-center max-md:w-full max-md:text-center max-sm:gap-5">
            <h5 className="text-5xl font-bold text-zinc-900 leading-normal max-md:w-full max-md:text-4xl max-sm:text-2xl max-sm:leading-tight text-left max-md:text-center">
              {t("sendRequestDescription")}
            </h5>
            <button className="flex gap-2 justify-center items-center px-6 py-3 rounded-lg border border-solid transition-all cursor-pointer bg-stone-50 border-zinc-400 duration-[0.2s] ease-[ease] max-sm:px-7 max-sm:py-3.5 max-sm:w-full hover:bg-gray-10">
              <span className="text-base font-semibold text-center text-zinc-900 max-sm:text-base">
                <span className="text-base font-bold text-zinc-900">
                  {t("sendRequest")}
                </span>
              </span>
            </button>
          </div>
          <Image
            src="/home_handyman_1.webp"
            alt="home handyman"
            width={330}
            height={398}
            sizes="(max-width: 768px) 100vw, 330px"
            className="object-cover w-[330px] h-[398px] max-md:w-full max-md:h-auto"
          />
        </div>
      </div>
    </section>
  );
}
