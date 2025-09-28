import Header from "@/components/Header/Header.component";
import { SiteFooterSection } from "@/components/sections/SiteFooterSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Профил",
  description: "Профил",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col bg-gray-10 text-gray-100 pt-[90px] min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-start px-[16px] md:px-4 py-8">
        {children}
      </main>
    </div>
  );
}
