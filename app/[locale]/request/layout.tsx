import type { Metadata } from "next";
import { LoginFooter } from "@/components/LoginFooter";

export const metadata: Metadata = {
  title: "FIX",
  description: "FIX",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col bg-gray-10 md:bg-gray-10 text-gray-100">
      <main className="flex-1 flex items-start justify-top py-8 bg-gray-10 w-full max-w-[1440px] mx-auto">
        {children}
      </main>
    </div>
  );
}
