import { Landing } from "@/components/Landing";
import { useLocale } from "next-intl";

export default function LocalizedHome() {
  // useLocale should represent language; keep behavior unchanged
  const locale = useLocale();
  return <Landing key={locale} />;
}
