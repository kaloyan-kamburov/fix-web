"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { clearAuth } from "@/lib/auth";
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
  ArrowLeftIcon,
  Globe,
  Trash,
} from "lucide-react";

export default function ProfilePage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

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
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

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
      <div className="flex flex-col items-center w-full max-w-[1440px] px-4">
        <div className="w-full max-w-[1440px]">
          <Link href={`/${locale}/profile`} className="flex items-center gap-2">
            <ArrowLeftIcon className="w-6 h-6 text-gray-100 cursor-pointer" />
            {t("back")}
          </Link>
        </div>
        <div className="w-full max-w-[720px]">
          <div className="flex flex-col items-center gap-6 w-full">
            <h1 className="text-2xl font-bold text-center text-gray-100">
              {t("settings")}
            </h1>

            <div className="flex flex-col items-center gap-4 w-full">
              {/* User Info Card */}

              {/* Menu Items */}
              <div className="flex flex-col gap-4 w-full">
                <Link
                  href={`/${locale}/profile/settings/languages`}
                  className="flex p-4 justify-between items-center w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity w-full bg-gray-00"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Globe size={32} className="flex-shrink-0 text-gray-50" />
                    <span className="text-lg font-bold text-gray-100">
                      {t("language")}
                    </span>
                  </div>
                  <ChevronRight
                    size={24}
                    className="flex-shrink-0 text-gray-50"
                  />
                </Link>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex p-4 justify-between items-center w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity bg-gray-00"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Trash
                      size={32}
                      className="flex-shrink-0 text-gray-50 text-red-500"
                    />
                    <span className="text-lg font-bold text-red-500">
                      {t("deleteAccount")}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4">
          <div className="w-full max-w-[520px] bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-100 mb-2">
              {t("areYouSureYouWantToDeleteAccount")}
            </h2>
            <p className="text-gray-50 mb-6">
              {t("deletedProfileCannotBeRestored")}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border border-[#dadade] text-gray-100 hover:bg-gray-10 cursor-pointer"
                disabled={isDeleting}
              >
                {t("cancel")}
              </button>
              <button
                onClick={async () => {
                  try {
                    setIsDeleting(true);
                    await api.delete("client/profile");
                    try {
                      await api.post("client/logout");
                    } catch (_) {}
                    clearAuth();
                    toast.success(t("accountDeleted"));
                    router.push(`/`);
                  } catch (_) {
                    setIsDeleting(false);
                  }
                }}
                className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 cursor-pointer"
                disabled={isDeleting}
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
