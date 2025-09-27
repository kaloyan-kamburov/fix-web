"use client";
import * as React from "react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { Label } from "@/components/Form/Label";
import { Select } from "@/components/Form/Select";
import Loader from "@/components/Loader/Loader";

export default function ReviewForm({
  employeeId,
  defaultOrderId,
  onSuccess,
  onCancel,
}: {
  employeeId: string;
  defaultOrderId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const t = useTranslations();
  const [rating, setRating] = React.useState<string>("5");
  const [text, setText] = React.useState<string>("");
  const [submitting, setSubmitting] = React.useState(false);

  const options = React.useMemo(() => ["1", "2", "3", "4", "5"], []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      await api.post("client/reviews", {
        employee_id: employeeId,
        order_id: defaultOrderId,
        rating: rating,
        text: text || undefined,
      });
      toast.success(t("reviewAddedSuccessfully"));
      setText("");
      setRating("5");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t("error", { default: "Възникна грешка" } as any);
      toast.error(String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full mt-6">
      <div className="flex flex-col gap-1">
        <Select
          label={t("rating", { default: "Оценка" } as any) + "*"}
          value={rating}
          options={options}
          onChange={(val) => setRating(val)}
          placeholder={t("rating", { default: "Оценка" } as any)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label
          htmlFor="review_text"
          className="text-xs font-semibold text-zinc-900"
        >
          {t("comment", { default: "Коментар" } as any)}
        </Label>
        <div className="self-stretch w-full bg-gray-20 rounded-lg border border-solid border-[#dadade]">
          <div className="flex items-start p-2">
            <textarea
              id="review_text"
              className="overflow-hidden text-sm leading-6 flex-[1_0_0] text-ellipsis text-zinc-900 bg-transparent border-none outline-none resize-none w-full h-full"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full gap-2">
        <button
          onClick={() => onCancel?.()}
          className="flex-1 px-4 py-2 rounded-lg border border-[#dadade] text-gray-100 hover:bg-gray-10 cursor-pointer flex-1"
          disabled={submitting}
        >
          {t("cancel")}
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 flex-1 py-3 bg-amber-200 rounded-lg cursor-pointer hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-default"
        >
          <div className="flex justify-center items-center text-base font-bold text-center text-zinc-900">
            {submitting ? (
              <Loader className="max-w-[24px] max-h-[24px]" />
            ) : (
              t("send")
            )}
          </div>
        </button>
      </div>
    </form>
  );
}
