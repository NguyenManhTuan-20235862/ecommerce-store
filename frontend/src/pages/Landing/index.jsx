import { useEffect, useState } from "react";
import { productService } from "../../services/product.service";
import { useAuthStore } from "../../store/authStore";
import { getImageUrl } from "../../utils/getImageUrl";
import DropsSection from "./components/DropsSection";
import HeroSection from "./components/HeroSection";
import LookbookSection from "./components/LookbookSection";
import MarqueeSection from "./components/MarqueeSection";
import SectionNavBar from "./components/SectionNavBar";
import TrendingSection from "./components/TrendingSection";
import {
  categories,
  drops,
  heroFeatureItems,
  heroStats,
  sectionNavItems,
  trendCards,
} from "./constants";

const BADGE_BY_CATEGORY = {
  ao: "Essential",
  quan: "Limited",
  "hoodie-sweater": "New Drop",
  giay: "Footwear",
  "phu-kien": "Gear",
};

export default function Landing({ isHomeMode = false }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [featuredDrops, setFeaturedDrops] = useState(drops);

  useEffect(() => {
    productService
      .list({ featured: true, limit: 4 })
      .then((res) => {
        const products = res.data?.products;
        if (products?.length > 0) {
          setFeaturedDrops(
            products.map((p) => ({
              _id: p._id,
              slug: p.slug,
              title: p.name,
              category: p.category?.name || "Clothing",
              price: p.price,
              compareAtPrice: p.compareAtPrice || 0,
              badge: BADGE_BY_CATEGORY[p.category?.slug] || "New Drop",
              tone: "from-[#1a1a1e] via-[#21212a] to-[#2f2f2e]",
              image: getImageUrl(p.images?.[0] || ""),
              variants: p.variants || [],
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

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
      <DropsSection drops={featuredDrops} />
      <TrendingSection trendCards={trendCards} />
      <MarqueeSection />
      <LookbookSection
        categories={categories}
        isAuthenticated={isAuthenticated}
      />
    </main>
  );
}
