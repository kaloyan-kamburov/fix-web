"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getAuth } from "@/lib/auth";
import { RequestStatusBadges } from "./RequestStatusBadges.component";

const tabs = [
  { id: "sent", label: "Изпратени" },
  { id: "active", label: "Активни" },
  { id: "history", label: "История" },
];

export default function Orders() {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const [data, setData] = useState<unknown>({});
  const router = useRouter();

  useEffect(() => {
    // Fetch orders (middleware guards access via cookie)
    (async () => {
      try {
        const res = await api.get("countries");
        setData(res.data);
      } catch (e) {
        // handled globally
      }
    })();
  }, [router]);

  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {/* <header className="self-center text-2xl font-bold text-zinc-900">
        <h1 className="text-center">Заявки</h1>
      </header>
      <nav className="flex flex-wrap gap-2 items-center pt-2 pb-3 mt-6 w-full text-base tracking-wider text-center whitespace-nowrap text-zinc-600 w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex justify-center flex-1 shrink justify-between items-center self-stretch px-2 py-3 my-auto font-semibold tracking-wide rounded border border-solid basis-0 border-zinc-300 cursor-pointer ${
              activeTab === tab.id
                ? "bg-zinc-200 text-zinc-900"
                : "text-zinc-600 "
            }`}
          >
            <span className="self-stretch my-auto">{tab.label}</span>
          </button>
        ))}
      </nav>
      <section className="mt-6 w-full max-md:max-w-full">
        <article className="flex flex-wrap gap-3 p-3 w-full rounded-lg bg-stone-50 max-md:max-w-full">
          <img
            src={imageUrl}
            alt={title}
            className="object-contain shrink-0 self-start rounded-lg aspect-square w-[104px]"
          />
          <div className="flex flex-col flex-1 shrink justify-between basis-0 min-w-60 max-md:max-w-full">
            <header className="flex flex-wrap gap-3 items-start w-full max-md:max-w-full">
              <div className="flex flex-col flex-1 shrink basis-0 min-w-60 text-neutral-700 max-md:max-w-full">
                <h3 className="text-lg font-bold text-neutral-700">{title}</h3>
                <div className="flex gap-2 items-center self-start mt-2 text-base">
                  <time className="self-stretch my-auto text-neutral-700">
                    {date}
                  </time>
                  <span className="self-stretch my-auto text-neutral-700">
                    {time}
                  </span>
                </div>
              </div>
              <RequestStatusBadges badges={badges} />
            </header>
            <div className="flex gap-4 items-center self-start mt-7">
              <div className="flex gap-0.5 items-center self-stretch my-auto text-base font-semibold tracking-wide text-center text-zinc-900">
                <span className="self-stretch my-auto text-zinc-900">
                  {priceRange}
                </span>
              </div>
              <div className="self-stretch my-auto text-sm text-neutral-700">
                {quantity}
              </div>
            </div>
          </div>
        </article>
      </section> */}
    </>
  );
}
