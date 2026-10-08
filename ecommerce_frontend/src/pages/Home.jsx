import HeroBanner from "../components/home/HeroBanner";
import CategoryShowcase from "../components/home/CategoryShowcase";
import EditorialSection from "../components/home/EditorialSection";
import ManifestoStrip from "../components/home/ManifestoStrip";
import BestSellersCarousel from "../components/home/BestSellersCarousel";
import LimitedPromo from "../components/home/LimitedPromo";
import NewArrivals from "../components/home/NewArrivals";
import FeaturedBanners from "../components/home/FeaturedBanners";
import Philosophy from "../components/home/Philosophy";
import ScrollReveal from "../components/animations/ScrollReveal";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <CategoryShowcase />
      <EditorialSection />
      <ManifestoStrip />
      <BestSellersCarousel />

      <ScrollReveal>
        <LimitedPromo />
      </ScrollReveal>

      <ScrollReveal>
        <NewArrivals />
      </ScrollReveal>

      <FeaturedBanners />

      <ScrollReveal>
        <Philosophy />
      </ScrollReveal>
    </div>
  );
}
