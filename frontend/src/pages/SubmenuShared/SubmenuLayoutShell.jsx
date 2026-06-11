import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import CategoryControls from "./components/CategoryControls";
import CategoryHeroPanel from "./components/CategoryHeroPanel";
import CategoryProductGrid from "./components/CategoryProductGrid";
import CategorySidebar from "./components/CategorySidebar";
import { CATEGORY_CONFIGS } from "./components/categoryConfigs";
import { useCategoryProducts } from "./hooks/useCategoryProducts";

const QUICK_SORTS = [
  { value: "newest", label: "Mới nhất", sub: "Hàng vừa về", icon: "✦" },
  { value: "price_asc", label: "Giá thấp → cao", sub: "Tiết kiệm nhất", icon: "↑" },
  { value: "price_desc", label: "Giá cao → thấp", sub: "Premium trước", icon: "↓" },
];

export default function SubmenuLayoutShell() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const isValid = Boolean(CATEGORY_CONFIGS[categorySlug]);

  useEffect(() => {
    if (!isValid) navigate("/shop", { replace: true });
  }, [isValid, navigate]);

  const {
    priceLimit,
    setPriceLimit,
    sortBy,
    handleSortChange,
    searchQuery,
    setSearchQuery,
    formattedProducts,
    total,
    hasMore,
    filterKey,
    loadMore,
  } = useCategoryProducts(isValid ? categorySlug : null);

  if (!isValid) return null;

  return (
    <section className="w-full bg-[#f9f6f5]">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Editorial hero — dark band đặc trưng cho từng danh mục */}
        <CategoryHeroPanel categorySlug={categorySlug} total={total} />

        {/* Main layout — 3 cột */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr_220px]">
          {/* Cột trái: Style tags + price filter */}
          <CategorySidebar
            categorySlug={categorySlug}
            searchQuery={searchQuery}
            onTagChange={setSearchQuery}
            priceLimit={priceLimit}
            onPriceLimitChange={setPriceLimit}
          />

          {/* Cột giữa: Grid sản phẩm */}
          <div>
            <CategoryControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
            <CategoryProductGrid
              products={formattedProducts}
              filterKey={filterKey}
              total={total}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
          </div>

          {/* Cột phải: Quick sort */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
              // SẮP XẾP
            </p>
            <div className="flex flex-col gap-3 lg:sticky lg:top-20">
              {QUICK_SORTS.map(({ value, label, sub, icon }) => {
                const isActive = sortBy === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleSortChange(value)}
                    className={`flex h-16 w-full cursor-pointer items-center gap-3 rounded-2xl px-5 text-left transition-all duration-200 ${
                      isActive
                        ? "bg-[#004be3] shadow-lg shadow-[#004be3]/20"
                        : "bg-[#0f172a] hover:bg-[#1e293b]"
                    }`}
                  >
                    <span className={`text-lg ${isActive ? "opacity-100" : "opacity-40"}`}>
                      {icon}
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white">
                        {label}
                      </p>
                      <p className={`text-[9px] tracking-wide ${isActive ? "text-white/70" : "text-white/30"}`}>
                        {sub}
                      </p>
                    </div>
                  </button>
                );
              })}

              <div className="mt-2 rounded-2xl border border-black/5 bg-[#f3f0ef] p-4">
                <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-[#94a3b8]">
                  // FREE SHIP
                </p>
                <p className="text-[11px] leading-relaxed text-[#5c5b5b]">
                  Miễn phí giao hàng cho đơn từ{" "}
                  <span className="font-bold text-[#004be3]">500.000đ</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
