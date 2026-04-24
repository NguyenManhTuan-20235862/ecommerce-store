import { useAuthStore } from "../../store/authStore";
import DropsSection from "./components/DropsSection";
import HeroSection from "./components/HeroSection";
import LandingFooter from "./components/LandingFooter";
import LookbookSection from "./components/LookbookSection";
import MarqueeSection from "./components/MarqueeSection";
import SectionNavBar from "./components/SectionNavBar";
import TrendingSection from "./components/TrendingSection";
import {
  categories,
  drops,
  footerLinks,
  heroFeatureItems,
  heroStats,
  sectionNavItems,
  trendCards,
} from "./constants";

export default function Landing({ isHomeMode = false }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <main className="overflow-hidden bg-[#f9f6f5] text-[#2f2f2e]">
      <SectionNavBar
        isAuthenticated={isAuthenticated}
        sectionNavItems={sectionNavItems}
      />
      <HeroSection
        isAuthenticated={isAuthenticated}
        isHomeMode={isHomeMode}
        heroStats={heroStats}
        heroFeatureItems={heroFeatureItems}
      />
      <DropsSection drops={drops} />
      <TrendingSection trendCards={trendCards} />
      <MarqueeSection />
      <LookbookSection
        categories={categories}
        isAuthenticated={isAuthenticated}
      />
      <LandingFooter footerLinks={footerLinks} />
    </main>
  );
}
