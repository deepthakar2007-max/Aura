import HeroBanner from "../components/home/HeroBanner";
import CategoryShowcase from "../components/home/CategoryShowcase";
import EditorialSection from "../components/home/EditorialSection";
import LimitedPromo from "../components/home/LimitedPromo";
import NewArrivals from "../components/home/NewArrivals";
import Philosophy from "../components/home/Philosophy";
import ScrollReveal from "../components/animations/ScrollReveal";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <CategoryShowcase />
      <EditorialSection />

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
