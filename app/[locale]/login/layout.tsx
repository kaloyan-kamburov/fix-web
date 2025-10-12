import type { Metadata } from "next";
import { LoginFooter } from "@/components/LoginFooter";

export const metadata: Metadata = {
  title: "FIX",
  description: "FIX",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-10 md:bg-gray-10 text-gray-100">
      <main className="flex-1 flex items-center justify-center px-[16px] md:px-4 py-8 pt-[88px]">
        {children}
      </main>
      <LoginFooter />
    </div>
  );
}
