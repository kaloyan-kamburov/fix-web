import type { Metadata } from "next";
import Header from "@/components/Header/Header.component";
import { SiteFooterSection } from "@/components/sections/SiteFooterSection";

export const metadata: Metadata = {
  title: "Моите поръчки",
  description: "Моите поръчки",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-10 text-gray-100 pt-[90px]">
      <main className="flex-1 flex items-center justify-start px-4 py-8 flex-col w-full max-w-[720px] mx-auto">
        {children}
      </main>
    </div>
  );
}
