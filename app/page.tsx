import { SiteFooterSection } from "@/components/sections/SiteFooterSection";
import Header from "../components/Header/Header.component";
import { Landing } from "../components/Landing";

export default function Home() {
  return (
    <div>
      <Header />
      <Landing />
      <SiteFooterSection />
    </div>
  );
}
