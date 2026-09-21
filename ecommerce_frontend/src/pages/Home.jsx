import AnnouncementBar from "../components/home/AnnouncementBar";
import HeroBanner from "../components/home/HeroBanner";
import CategoryShowcase from "../components/home/CategoryShowcase";
import LimitedPromo from "../components/home/LimitedPromo";
import NewArrivals from "../components/home/NewArrivals";
import Philosophy from "../components/home/Philosophy";
import ScrollReveal from "../components/animations/ScrollReveal";

export default function Home() {
  return (
    <div>
      <HeroBanner />

      <ScrollReveal>
        <AnnouncementBar />
      </ScrollReveal>

      <ScrollReveal>
        <CategoryShowcase />
      </ScrollReveal>

      <ScrollReveal>
        <LimitedPromo />
      </ScrollReveal>

      <ScrollReveal>
        <NewArrivals />
      </ScrollReveal>

      <ScrollReveal>
        <Philosophy />
      </ScrollReveal>
    </div>
  );
}
