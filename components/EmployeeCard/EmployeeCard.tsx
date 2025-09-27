import { useLocale, useTranslations } from "next-intl";
import { StarRating } from "@/components/StarRating/StarRating";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

const EmployeeCard = ({
  name,
  phone,
  rating,
  reviewCount,
  id,
}: {
  name: string;
  phone: string;
  rating: number;
  reviewCount: number;
  id: string;
}) => {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <div className="flex relative flex-col gap-3 items-start self-stretch p-3 rounded-lg border border-solid bg-zinc-100 border-zinc-300 max-md:gap-2.5 max-md:p-2.5 max-sm:gap-2 max-sm:p-2">
      <div className="flex relative gap-1 items-center max-sm:flex-col max-sm:gap-0.5 max-sm:items-start">
        <span className="relative text-sm text-zinc-600 max-sm:text-xs">
          {t("name")}
        </span>
        <span className="relative text-sm font-semibold text-zinc-900 max-sm:text-xs font-bold">
          {name}:
        </span>
      </div>
      <div className="flex relative gap-1 items-center max-sm:flex-col max-sm:gap-0.5 max-sm:items-start">
        <span className="relative text-sm text-zinc-600 max-sm:text-xs">
          {t("phone")}:
        </span>
        <span className="relative text-sm font-semibold text-zinc-900 max-sm:text-xs font-bold">
          {phone}
        </span>
      </div>
      <section className="flex relative flex-col gap-2 justify-center items-start self-stretch">
        <h3 className="relative text-base text-zinc-600 max-sm:text-xs">
          {t("rating")}
        </h3>
        <div className="flex relative justify-between items-center self-stretch max-md:flex-col max-md:gap-2 max-md:items-start max-sm:flex-col max-sm:gap-1.5 max-sm:items-start">
          <div className="flex relative gap-0.5 items-center">
            <StarRating rating={rating} reviewCount={reviewCount} />
          </div>
          <Link
            href={`/${locale}/employees/${id}`}
            className="flex relative gap-0.5 justify-end items-center max-md:self-end max-sm:self-start"
          >
            <span className="relative text-sm font-bold text-center text-neutral-700 max-sm:text-xs">
              {t("profile")}
            </span>
            <ChevronRightIcon />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default EmployeeCard;
