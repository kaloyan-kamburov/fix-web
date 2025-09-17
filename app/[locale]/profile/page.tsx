"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  Phone,
  Mail,
  MapPin,
  Edit,
  Settings,
  FileText,
  HelpCircle,
  Shield,
  ChevronRight,
} from "lucide-react";

export default function ProfilePage() {
  const t = useTranslations();
  const locale = useLocale();

  type MeResponse = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    email_verified_at: string | null;
    has_verified_email: boolean;
    phone: string | null;
    address: string | null;
    city: string | null;
    neighborhood: string | null;
    status: string;
    language: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };

  const [me, setMe] = React.useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        setIsLoading(true);
        const res = await api.get<MeResponse>("client/me");
        if (!active) return;
        setMe(res.data);
        setError(null);
      } catch (e) {
        if (!active) return;
        setError("failed");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full px-4 sm:px-8 bg-gray-10">
      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-100">{t("profile")}</h1>

        <div className="flex flex-col items-center gap-4 w-full">
          {/* User Info Card */}
          <div className="flex flex-col sm:flex-row p-4 justify-between items-start gap-4 w-full rounded-lg relative bg-gray-00">
            <div className="flex flex-col items-start gap-3 flex-1">
              {/* User Name Section */}
              <div className="flex flex-col items-start gap-1 w-full">
                <h2 className="text-lg font-bold text-gray-100">
                  {isLoading
                    ? ""
                    : `${me?.first_name ?? ""} ${me?.last_name ?? ""}`.trim() ||
                      "—"}
                </h2>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2">
                  <Phone size={24} className="flex-shrink-0 text-gray-50" />
                  <span className="text-base font-normal text-gray-100">
                    {isLoading ? "" : me?.phone || "—"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail size={24} className="flex-shrink-0 text-gray-50" />
                  <span className="text-base font-normal text-gray-100">
                    {isLoading ? "" : me?.email || "—"}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin
                    size={24}
                    className="flex-shrink-0 mt-0.5 text-gray-50"
                  />
                  <div className="flex flex-wrap gap-1">
                    <span className="text-base font-normal text-gray-100">
                      {isLoading ? "" : me?.city || t("cityNotSpecified")}
                    </span>
                    <span className="text-base font-normal text-gray-100">
                      {isLoading ? "" : me?.address || me?.neighborhood || ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Icon */}
            <Link
              href={`/${locale}/profile/edit`}
              aria-label={t("editProfileClient")}
              className="absolute right-4 top-4"
            >
              <Edit
                size={24}
                className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0 text-gray-50"
              />
            </Link>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col gap-4 w-full">
            <Link
              href={`/${locale}/profile/settings`}
              aria-label={t("settings")}
              className="flex p-4 justify-between items-center w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity w-full bg-gray-00"
            >
              <div className="flex items-center gap-2 flex-1">
                <Settings size={32} className="flex-shrink-0 text-gray-50" />
                <span className="text-lg font-bold text-gray-100">
                  {t("settings")}
                </span>
              </div>
              <ChevronRight size={24} className="flex-shrink-0 text-gray-50" />
            </Link>

            {/* <button
              className="flex p-4 justify-between items-center w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#F9F9F9" }}
            >
              <div className="flex items-center gap-2 flex-1">
                <FileText
                  size={32}
                  style={{ color: "#959499" }}
                  className="flex-shrink-0"
                />
                <span
                  className="text-lg font-bold"
                  style={{
                    color: "#1C1C1D",
                    fontFamily:
                      "'Open Sans', -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  {t("termsOfService")}
                </span>
              </div>
              <ChevronRight
                size={24}
                style={{ color: "#959499" }}
                className="flex-shrink-0"
              />
            </button> */}

            {/* <button
              className="flex p-4 justify-between items-center w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#F9F9F9" }}
            >
              <div className="flex items-center gap-2 flex-1">
                <HelpCircle
                  size={32}
                  style={{ color: "#959499" }}
                  className="flex-shrink-0"
                />
                <span
                  className="text-lg font-bold"
                  style={{
                    color: "#1C1C1D",
                    fontFamily:
                      "'Open Sans', -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  {t("help")}
                </span>
              </div>
              <ChevronRight
                size={24}
                style={{ color: "#959499" }}
                className="flex-shrink-0"
              />
            </button> */}

            {/* <button
              className="flex p-4 justify-between items-center w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#F9F9F9" }}
            >
              <div className="flex items-center gap-2 flex-1">
                <Shield
                  size={32}
                  style={{ color: "#959499" }}
                  className="flex-shrink-0"
                />
                <span
                  className="text-lg font-bold"
                  style={{
                    color: "#1C1C1D",
                    fontFamily:
                      "'Open Sans', -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  {t("privacyPolicy")}
                </span>
              </div>
              <ChevronRight
                size={24}
                style={{ color: "#959499" }}
                className="flex-shrink-0"
              />
            </button> */}
          </div>

          {/* CTA Button */}
          {/* <div className="w-full py-3">
            <button
              className="flex py-3 px-6 justify-center items-center gap-2 w-full rounded-lg border cursor-pointer hover:opacity-90 transition-opacity text-base font-bold"
              style={{
                backgroundColor: "#F9F9F9",
                borderColor: "#B3B3B7",
                color: "#1C1C1D",
                fontFamily:
                  "'Open Sans', -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              {t("contactUs")}
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
