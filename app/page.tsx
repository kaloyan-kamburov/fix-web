import { redirect } from "next/navigation";

export default function Home() {
  // Redirect root to default locale to ensure pages render under i18n provider
  redirect("/bg");
}
