"use client";
import * as React from "react";
import { api } from "@/lib/api";
import Loader from "@/components/Loader/Loader";

type Timeframe = { start_time: string; end_time: string };

export const TimeSlotButton = ({
  onClick,
  onSelect,
  selected,
}: {
  onClick?: () => void;
  onSelect?: (timeframe: Timeframe) => void;
  selected?: Timeframe | null;
}) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<unknown>(null);

  const handleOpen = () => {
    if (onClick) onClick();
    setOpen(true);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("settings/order_interval_timeframes", {
          headers: {
            "app-locale": "bg",
          },
        });
        setData(res?.data ?? null);
        setLoading(false);
      } catch (_) {
        setData({ error: true });
      } finally {
        setLoading(false);
      }
    };
    if (open && data == null && !loading) {
      fetchData();
    }
  }, [open, data, loading]);

  // Safety: if data arrived but loading somehow remained true, flip it off
  React.useEffect(() => {
    if (open && loading && data != null) {
      setLoading(false);
    }
  }, [open, loading, data]);

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex gap-2 justify-center items-center self-stretch px-6 py-3 rounded-lg border border-solid cursor-pointer bg-stone-50 border-zinc-400 max-md:px-5 max-md:py-2.5 max-sm:px-4 max-sm:py-2"
        aria-label="Избор на ден и час"
      >
        <span className="text-base font-semibold text-center text-zinc-900 max-md:text-base max-sm:text-sm">
          {selected
            ? `${selected.start_time} - ${selected.end_time}`
            : "Избор на ден и час"}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-[90vw] max-w-[500px]  max-h-[80vh] min-h-[150px] overflow-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-zinc-900">
                Налични интервали
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Затвори"
                className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-gray-10"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18"
                    stroke="#1C1C1D"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 6L18 18"
                    stroke="#1C1C1D"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            {loading ? (
              <div className="text-sm text-zinc-500 flex justify-center items-center h-full">
                <Loader />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 pt-[15px]">
                {(Array.isArray(data)
                  ? (data as unknown as Timeframe[])
                  : []
                ).map((tf, idx) => (
                  <button
                    key={`${tf.start_time}-${tf.end_time}-${idx}`}
                    type="button"
                    onClick={() => {
                      onSelect?.(tf);
                      setOpen(false);
                    }}
                    className="flex gap-2 justify-center items-center w-full px-6 py-3 rounded-lg border border-solid cursor-pointer bg-transparent border-zinc-400 text-zinc-900 max-md:px-5 max-md:py-2.5"
                  >
                    <span className="text-base font-semibold text-center">
                      {tf.start_time} - {tf.end_time}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
