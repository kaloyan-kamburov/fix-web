"use client";
import React from "react";
import { createPortal } from "react-dom";
import { api } from "@/lib/api";
import Loader from "../Loader/Loader";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export type LegalModalProps = {
  open: boolean;
  onClose: () => void;
  type: "terms" | "gdpr" | "rules";
};

export const LegalModal: React.FC<LegalModalProps> = ({
  open,
  onClose,
  type,
}) => {
  const [mounted, setMounted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [content, setContent] = React.useState<string>("");
  const t = useTranslations();
  const { locale } = useParams();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (open && mounted) {
      loadContent();
    }
  }, [open, mounted, type]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const lang = Array.isArray(locale)
        ? (locale[0] || "bg").split("-")[0]
        : ((locale as string) || "bg").split("-")[0];
      const res = await api.get(`static-texts/${type}`, {
        headers: {
          "app-locale": lang,
        },
      });
      const data = res.data;
      const textContent = data?.content || data?.text || data || "";
      setContent(String(textContent));
    } catch (error) {
      console.error(`Failed to load ${type} content:`, error);
      setContent(t("somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case "terms":
        return t("termsOfService");
      case "gdpr":
        return t("privacyPolicy");
      case "rules":
        return "Rules";
      default:
        return "Legal Document";
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor:
            "color-mix(in oklab, var(--color-black) 75%, transparent)",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col overflow-hidden ${
          open ? "scale-100" : "scale-95"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader />
            </div>
          ) : (
            <div
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
