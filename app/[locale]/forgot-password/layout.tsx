import type { Metadata } from "next";
import { LoginFooter } from "@/components/LoginFooter";

export const metadata: Metadata = {
  title: "Забравена парола",
  description: "Възстановяване на парола",
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
    <div className="min-h-screen flex flex-col bg-gray-10 text-gray-100">
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>
      <LoginFooter />
    </div>
  );
}
