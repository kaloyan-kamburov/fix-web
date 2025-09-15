import { Landing } from "@/components/Landing";
import { useLocale } from "next-intl";

export default function LocalizedHome() {
  const locale = useLocale();
  return <Landing key={locale} />;
}
