import HeroSection from "./components/HeroSection";
import PerksSection from "./components/PerksSection";
import CouponsSection from "./components/CouponsSection";
import TierSection from "./components/TierSection";
import ComboSection from "./components/ComboSection";
import ProductsSection from "./components/ProductsSection";
import FaqNewsletterSection from "./components/FaqNewsletterSection";

export default function Sale() {
  return (
    <div className="bg-[#f9f6f5] min-h-screen text-[#2f2f2e] font-sans pb-20 pt-4 flex flex-col">
      <HeroSection />
      <PerksSection />
      <CouponsSection />
      <TierSection />
      <ComboSection />
      <ProductsSection />
      <FaqNewsletterSection />
    </div>
  );
}
