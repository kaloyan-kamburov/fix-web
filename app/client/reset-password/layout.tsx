import type { Metadata } from "next";
import { LoginFooter } from "@/components/LoginFooter";

export const metadata: Metadata = {
  title: "Смяна на парола",
  description: "Смени паролата си",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-10 text-gray-100">
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>
      <LoginFooter />
    </div>
  );
}
