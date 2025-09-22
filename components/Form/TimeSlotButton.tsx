"use client";
import * as React from "react";
import { api } from "@/lib/api";
import Loader from "@/components/Loader/Loader";
import Calendar from "react-calendar";
import { useTranslations } from "next-intl";

type Timeframe = { start_time: string; end_time: string };

export const TimeSlotButton = ({
  onClick,
  onSelect,
  selected,
  onSave,
  initialIntervals,
}: {
  onClick?: () => void;
  onSelect?: (timeframe: Timeframe) => void;
  selected?: Timeframe | null;
  onSave?: (
    intervals: Array<{ date: string; start_time: string; end_time: string }>
  ) => void;
  initialIntervals?: Array<{
    date: string;
    start_time: string;
    end_time: string;
  }>;
}) => {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<unknown>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date()
  );
  const [selections, setSelections] = React.useState<
    Record<string, Set<string>>
  >(() => {
    const map: Record<string, Set<string>> = {};
    if (Array.isArray(initialIntervals)) {
      for (const it of initialIntervals) {
        const key = it.date;
        const tfKey = `${it.start_time}-${it.end_time}`;
        if (!map[key]) map[key] = new Set<string>();
        map[key].add(tfKey);
      }
    }
    return map;
  });

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

  // i18n helpers for Calendar labels
  const MONTH_KEYS = React.useMemo(
    () =>
      [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
      ] as const,
    []
  );
  const WEEKDAY_KEYS = React.useMemo(
    () => ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const,
    []
  );
  const monthKeyOf = (date: Date): string => MONTH_KEYS[date.getMonth()];
  const weekdayKeyOf = (date: Date): string => WEEKDAY_KEYS[date.getDay()];

  const dateKeyOf = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const minSelectableDate = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const toggleTimeframeForSelectedDate = (tf: Timeframe) => {
    if (!selectedDate) return;
    const dayKey = dateKeyOf(selectedDate);
    const tfKey = `${tf.start_time}-${tf.end_time}`;
    setSelections((prev) => {
      const next: Record<string, Set<string>> = { ...prev };
      const set = new Set(next[dayKey] ? Array.from(next[dayKey]) : []);
      if (set.has(tfKey)) set.delete(tfKey);
      else set.add(tfKey);
      if (set.size === 0) delete next[dayKey];
      else next[dayKey] = set;
      return next;
    });
  };

  const removeDay = (dayKey: string) => {
    setSelections((prev) => {
      const next = { ...prev } as Record<string, Set<string>>;
      delete next[dayKey];
      return next;
    });
  };

  const handleSave = () => {
    const intervals: Array<{
      date: string;
      start_time: string;
      end_time: string;
    }> = [];
    for (const [dayKey, set] of Object.entries(selections)) {
      for (const entry of set) {
        const [start_time, end_time] = entry.split("-");
        intervals.push({ date: dayKey, start_time, end_time });
      }
    }
    onSave?.(intervals);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
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
                className="w-8 h-8 inline-flex items-center justify-center rounded-full"
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
              <div className="flex flex-col gap-2">
                <Calendar
                  onChange={(val) => {
                    const d = Array.isArray(val) ? val[0] : (val as Date);
                    setSelectedDate(d);
                  }}
                  value={selectedDate || undefined}
                  formatMonthYear={(_l, date) => t(monthKeyOf(date))}
                  formatShortWeekday={(_l, date) => t(weekdayKeyOf(date))}
                  minDate={minSelectableDate}
                />
                <div className="grid grid-cols-3 gap-2 pt-[15px]">
                  {(Array.isArray(data)
                    ? (data as unknown as Timeframe[])
                    : []
                  ).map((tf, idx) => (
                    <button
                      key={`${tf.start_time}-${tf.end_time}-${idx}`}
                      type="button"
                      onClick={() => toggleTimeframeForSelectedDate(tf)}
                      className={(() => {
                        const active = selectedDate
                          ? selections[dateKeyOf(selectedDate)]?.has(
                              `${tf.start_time}-${tf.end_time}`
                            )
                          : false;
                        return (
                          "flex gap-2 justify-center items-center w-full px-6 py-3 rounded-lg border border-solid cursor-pointer max-md:px-5 max-md:py-2.5 " +
                          (active
                            ? "bg-zinc-900 text-white border-zinc-900"
                            : "bg-transparent text-zinc-900 border-zinc-400")
                        );
                      })()}
                    >
                      <span className="text-base font-semibold text-center">
                        {tf.start_time} - {tf.end_time}
                      </span>
                    </button>
                  ))}
                </div>
                {/* Selected per-day summary */}
                {Object.keys(selections).length > 0 && (
                  <div className="flex flex-col gap-2 mt-4">
                    {Object.entries(selections).map(([dayKey, set]) => {
                      const parts = dayKey.split("-");
                      const label = (() => {
                        const d = new Date(
                          Number(parts[0]),
                          Number(parts[1]) - 1,
                          Number(parts[2])
                        );
                        const y = d.getFullYear();
                        const mon = d.toLocaleString("en-US", {
                          month: "short",
                        });
                        const day = String(d.getDate()).padStart(2, "0");
                        return `${y} ${mon} ${day}`;
                      })();
                      const list = Array.from(set)
                        .map((s) => s.replace("-", " - "))
                        .join(", ");
                      return (
                        <div
                          key={dayKey}
                          className="flex items-center justify-between gap-3 rounded-md border border-zinc-300 px-3 py-2"
                        >
                          <span className="text-sm text-zinc-900">
                            {label}: {list}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeDay(dayKey)}
                            className="w-6 h-6 inline-flex items-center justify-center rounded-full"
                          >
                            <svg
                              width="12"
                              height="12"
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
                      );
                    })}
                  </div>
                )}
                <button
                  className="px-5 py-2.5 mt-[15px] rounded-lg bg-button-primary-bg text-black hover:bg-button-primary-bg/90 focus:outline-none focus:ring-2 focus:ring-button-primary-bg cursor-pointer"
                  onClick={handleSave}
                  type="button"
                >
                  <span className="self-stretch my-auto text-zinc-900">
                    {t("save")}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
