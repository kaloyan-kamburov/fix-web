import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { api } from "@/lib/api";
import Image from "next/image";
import EmployeeGallery from "@/components/EmployeeCard/EmployeeGallery";
import OpenReviewsButton from "./OpenReviewsButton";

const EmployeePage = async ({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) => {
  const { locale, id } = await params;
  const t = await getTranslations({ locale });

  const res = await api.get(`client/portfolio/${id}`);
  const profile = res?.data ?? {};

  const name = `${profile?.first_name ?? ""} ${
    profile?.last_name ?? ""
  }`.trim();
  const avatarSrc = String(profile?.profile_picture || "/phones.webp");
  const description: string = String(profile?.description || "");
  const images: string[] = Array.isArray(profile?.images) ? profile.images : [];
  const services: any[] = Array.isArray(profile?.services)
    ? profile.services
    : [];
  const avgRating: number = Number(profile?.review_avg_rating || 0);
  const reviewCount: number = Number(profile?.reviews_count || 0);

  return (
    <div className="flex relative flex-col gap-6 items-start w-full flex-1 pt-[76px] max-md:pt-[76px]">
      <div className="mx-auto w-full">
        <Link
          href={`/${locale}`}
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

      <div className="flex relative flex-col p-10 rounded-[16px] bg-white mx-auto w-full max-w-[960px]">
        <h1 className="text-2xl font-bold text-zinc-900">
          {t("employeeProfile")}
        </h1>
        <div className="flex flex-col items-start gap-4 mt-6">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-30">
            <Image
              src={avatarSrc}
              alt={`${name} profile picture`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-zinc-900">{name || "N/A"}</h1>
          </div>
          <OpenReviewsButton rating={avgRating} total={reviewCount} />
        </div>

        <section className="mt-6">
          <h3 className="text-lg font-bold text-zinc-900">{t("services")}</h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {services.map((svc) => svc.name).join(", ")}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="text-lg font-bold text-zinc-900">{t("projects")}</h3>
          <div className="mt-4">
            <EmployeeGallery images={images} />
          </div>
        </section>

        {description && (
          <section className="mt-6">
            <h3 className="text-zinc-600">{t("experience")}</h3>
            <p className="mt-2 font-semibold text-zinc-900">{description}</p>
          </section>
        )}
      </div>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </div>
  );
};

export default EmployeePage;

//review response
// "data": [
//         {
//             "id": 1,
//             "employee_id": 4,
//             "employee_name": "Destiney Sipes",
//             "order_id": 39,
//             "rating": 1,
//             "text": "Molestias sit deleniti quaerat perferendis.",
//             "created": "Дек 2023",
//             "client_name": "client test",
//             "service_name": "repair"
//         },
// ]
