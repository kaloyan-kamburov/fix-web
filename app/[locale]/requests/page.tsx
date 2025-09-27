"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useTranslations } from "next-intl";
import { RequestItem } from "./RequestItem";
import Loader from "@/components/Loader/Loader";

// REQUEST object:
// {
//   "id": 175,
//   "currency": {
//     "id": 1,
//     "name": "BGN",
//     "code": "BGN",
//     "symbol": "BGN",
//     "active": 1
//   },
//   "rate": "1.955830",
//   "second_currency": {
//     "id": 2,
//     "name": "EUR",
//     "code": "EUR",
//     "symbol": "€",
//     "active": 1
//   },
//   "price": 30,
//   "price_second": "15.34",
//   "price_from": 60,
//   "price_from_second": "30.68",
//   "price_to": 401.40000000000003,
//   "price_to_second": "205.23",
//   "total": null,
//   "total_second": "0",
//   "use_fixed_price": false,
//   "kmp_commission_percentage": null,
//   "organization_commission_percentage": null,
//   "service_picture": "",
//   "client_intervals": [
//     {
//       "id": 170,
//       "date": "2025-09-21",
//       "start_time": "08:00",
//       "end_time": "12:00"
//     },
//     {
//       "id": 171,
//       "date": "2025-09-21",
//       "start_time": "12:00",
//       "end_time": "16:00"
//     },
//     {
//       "id": 172,
//       "date": "2025-09-21",
//       "start_time": "16:00",
//       "end_time": "20:00"
//     },
//     {
//       "id": 173,
//       "date": "2025-09-22",
//       "start_time": "08:00",
//       "end_time": "12:00"
//     },
//     {
//       "id": 174,
//       "date": "2025-09-22",
//       "start_time": "12:00",
//       "end_time": "16:00"
//     },
//     {
//       "id": 175,
//       "date": "2025-09-22",
//       "start_time": "16:00",
//       "end_time": "20:00"
//     },
//     {
//       "id": 176,
//       "date": "2025-09-24",
//       "start_time": "08:00",
//       "end_time": "12:00"
//     },
//     {
//       "id": 177,
//       "date": "2025-09-24",
//       "start_time": "16:00",
//       "end_time": "20:00"
//     },
//     {
//       "id": 178,
//       "date": "2025-09-23",
//       "start_time": "08:00",
//       "end_time": "12:00"
//     },
//     {
//       "id": 179,
//       "date": "2025-09-23",
//       "start_time": "12:00",
//       "end_time": "16:00"
//     },
//     {
//       "id": 180,
//       "date": "2025-09-23",
//       "start_time": "16:00",
//       "end_time": "20:00"
//     }
//   ],
//   "employee_intervals": [],
//   "client_comment": null,
//   "employee_comment": null,
//   "client_paid": false,
//   "employee_paid": 0,
//   "phone": "0888751534",
//   "city": "Alfatar",
//   "address": "Neofit Bozveli 7",
//   "neighbourhood": "123",
//   "payment_date": null,
//   "organization_id": null,
//   "client_id": 100,
//   "employee_id": null,
//   "service_id": 3832,
//   "category_id": 17,
//   "status": "new_order",
//   "latitude": null,
//   "longitude": null,
//   "created_at": "2025-09-22 21:05:57",
//   "updated_at": "2025-09-22 21:05:57",
//   "service_name": "Inspection and Diagnosis",
//   "service_metrics_type": "linear",
//   "services": [],
//   "offers_count": 0,
//   "reviews_count": 0,
//   "review_avg_rating": 0,
//   "employee_phone": null,
//   "employee_name": null,
//   "client_name": "Kaloyan Kamburov",
//   "client_review": null,
//   "client_review_rating": null,
//   "request_completed_at": null,
//   "request_finished_at": null,
//   "urgent": false,
//   "quantity": 3,
//   "inactivity_deadline_at": "2025-09-29 21:05:57",
//   "has_claim": false,
//   "offer_id": null,
//   "country_region": {
//     "id": 26,
//     "name": "Yambol",
//     "country_id": 26
//   }
// }

export default function Requests() {
  const router = useRouter();
  const t = useTranslations();
  const tabs = useMemo(
    () => [
      { id: "sent", label: t("sent") },
      { id: "active", label: t("active") },
      { id: "history", label: t("history") },
    ],
    [t]
  );
  const [activeTab, setActiveTab] = useState<string>("");
  const [data, setData] = useState<unknown>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // sent -> new_order
    // active -> approved_offer,request_completed
    // history -> request_finished, paid

    (async () => {
      try {
        setLoading(true);
        let url = "";
        if (activeTab === "sent") {
          url = "/client/orders?filter[status]=new_order";
        } else if (activeTab === "active") {
          url =
            "/client/orders?filter[status]=approved_offer,request_completed";
        } else if (activeTab === "history") {
          url = "/client/orders?filter[status]=request_finished,paid";
        }

        if (url) {
          const res = await api.get(url);
          setData(res.data);
        }
      } catch (e) {
        setData({ error: true });
      } finally {
        setLoading(false);
      }
    })();
    window.scrollTo(0, 0);
  }, [activeTab]);

  const items = useMemo(() => {
    const root: any = data;
    const arr: any[] = Array.isArray(root)
      ? root
      : Array.isArray(root?.data)
      ? root.data
      : [];
    return arr.map((it) => {
      const id: string = String(it?.id || "");
      const picture: string = String(it?.service_picture);
      const title: string = String(it?.service_name || "");
      const intervals: any[] = Array.isArray(it?.client_intervals)
        ? it.client_intervals
        : [];
      const dateToIntervals = new Map<
        string,
        Array<{ start_time: string; end_time: string }>
      >();
      for (const iv of intervals) {
        const d = String(iv?.date || "");
        const st = String(iv?.start_time || "");
        const et = String(iv?.end_time || "");
        if (!d || !st || !et) continue;
        if (!dateToIntervals.has(d)) dateToIntervals.set(d, []);
        dateToIntervals.get(d)!.push({ start_time: st, end_time: et });
      }
      let dateLabel = "";
      let timeLabel = "";
      if (dateToIntervals.size > 0) {
        const days = Array.from(dateToIntervals.keys()).sort();
        const first = days[0];
        const d = first.split("-");
        const dd = new Date(Number(d[0]), Number(d[1]) - 1, Number(d[2]));
        const y = dd.getFullYear();
        const mon = dd.toLocaleString("en-US", { month: "short" });
        const day = String(dd.getDate()).padStart(2, "0");
        dateLabel = `${y} ${mon} ${day}`;
        const list = (dateToIntervals.get(first) || [])
          .map((iv) => `${iv.start_time} - ${iv.end_time}`)
          .join(", ");
        timeLabel = list;
      }
      const currency = String(it?.currency?.symbol || it?.currency?.code || "");
      const currency2 = String(
        it?.second_currency?.symbol || it?.second_currency?.code || ""
      );
      const useFixed = !!it?.use_fixed_price;
      const priceFrom = it?.price_from != null ? String(it.price_from) : null;
      const priceTo = it?.price_to != null ? String(it.price_to) : null;
      const fixedPrice = it?.price != null ? String(it.price) : null;
      const priceFrom2 =
        it?.price_from_second != null ? String(it.price_from_second) : null;
      const priceTo2 =
        it?.price_to_second != null ? String(it.price_to_second) : null;
      const fixed2 = it?.price_second != null ? String(it.price_second) : null;
      const primary = useFixed
        ? fixedPrice
        : priceFrom && priceTo
        ? `${priceFrom} - ${priceTo}`
        : priceFrom || priceTo || null;
      const secondary = useFixed
        ? fixed2
        : priceFrom2 && priceTo2
        ? `${priceFrom2} - ${priceTo2}`
        : priceFrom2 || priceTo2 || null;
      const priceLabel = [
        primary ? `${primary} ${currency}` : null,
        secondary ? `(${secondary} ${currency2})` : null,
      ]
        .filter(Boolean)
        .join(" ");
      const quantityLabel = `x ${it?.quantity || 1}`;

      const offersLabel = it?.offers_count
        ? `${it.offers_count} ${it.offers_count > 1 ? t("offers") : t("offer")}`
        : undefined;
      const urgent = !!it?.urgent;
      return {
        id: it?.id,
        image: picture,
        title,
        date: dateLabel,
        time: timeLabel,
        price: priceLabel,
        quantity: quantityLabel,
        offers: offersLabel,
        isUrgent: urgent,
      };
    });
  }, [data, t]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setActiveTab(hash.slice(1));
    }
  }, []);

  return (
    <>
      <div className="flex flex-col w-full max-w-[720px]">
        <header className="self-center text-2xl font-bold text-zinc-900 mt-4">
          {t("requests")}
        </header>
        <nav className="flex flex-wrap gap-2 items-center pt-2 pb-3 mt-6 w-full text-base tracking-wider text-center whitespace-nowrap text-zinc-600 max-md:max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.location.hash = tab.id;
              }}
              className={`flex flex-1 shrink justify-between items-center self-stretch px-2 py-3 my-auto rounded border border-solid basis-0 border-zinc-300 text-center ${
                activeTab === tab.id
                  ? "font-semibold tracking-wide bg-zinc-200 text-zinc-900"
                  : "text-zinc-600"
              }`}
            >
              <span
                className={`self-stretch m-auto ${
                  activeTab === tab.id ? "text-zinc-900" : "text-zinc-600"
                }`}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </nav>
        <section className="mt-6 w-full max-md:max-w-full">
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          ) : items.length === 0 ? (
            <div className="text-sm text-zinc-500 text-center">
              {t("noResults")}
            </div>
          ) : (
            items.map((request: any, index: number) => (
              <div
                key={request.id || index}
                className={index > 0 ? "mt-4" : ""}
              >
                <RequestItem
                  id={request.id}
                  image={request.image}
                  title={request.title}
                  date={request.date}
                  time={request.time}
                  price={request.price}
                  quantity={request.quantity}
                  offers={request.offers}
                  isUrgent={request.isUrgent}
                  shouldHideOfferCount={activeTab !== "sent"}
                />
              </div>
            ))
          )}
        </section>
      </div>
      {/* <pre>{JSON.stringify(data?.data?.length, null, 2)}</pre> */}
    </>
  );
}
