import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { fadeUpItem, staggerContainer } from "../../animations/variants";
import { productService } from "../../services/product.service";
import { getImageUrl } from "../../utils/getImageUrl";
import FilterSidebar from "./components/FilterSidebar";
import ProductTile from "./components/ProductTile";
import { maxPrice } from "./components/shopData";

const sortOptions = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const QUICK_SORTS = [
  { value: "newest", label: "Mới nhất", sub: "Hàng vừa về", icon: "✦" },
  { value: "price_asc", label: "Giá thấp → cao", sub: "Tiết kiệm nhất", icon: "↑" },
  { value: "price_desc", label: "Giá cao → thấp", sub: "Premium trước", icon: "↓" },
];

export default function Shop() {
  const navigate = useNavigate();
  const [priceLimit, setPriceLimit] = useState(maxPrice);
  const [debouncedPriceLimit, setDebouncedPriceLimit] = useState(maxPrice);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [products, setProducts] = useState([]);
  const [loadCursor, setLoadCursor] = useState(null); // null = fresh load, string = append
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  // Khi click category trong sidebar → chuyển sang trang submenu riêng
  function handleCategoryChange(categoryKey) {
    if (categoryKey) navigate(`/shop/${categoryKey}`);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setLoadCursor(null);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Debounce price — tự động áp dụng sau 400ms kéo slider
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceLimit(priceLimit);
      setLoadCursor(null);
    }, 400);
    return () => clearTimeout(timer);
  }, [priceLimit]);

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      try {
        const params = {
          cursor: loadCursor || undefined,
          limit: 8,
          maxPrice: debouncedPriceLimit < maxPrice ? debouncedPriceLimit : undefined,
          sort: sortBy,
          search: debouncedSearch || undefined,
        };
        const res = await productService.list(params);
        if (!cancelled && res.data) {
          const incoming = res.data.products;
          const newNextCursor = res.data.pagination.nextCursor ?? null;

          if (loadCursor) {
            setProducts((prev) => {
              const existingIds = new Set(prev.map((p) => p._id));
              return [...prev, ...incoming.filter((p) => !existingIds.has(p._id))];
            });
          } else {
            setProducts(incoming);
          }

          setNextCursor(newNextCursor);
          setHasMore(newNextCursor !== null);
          setTotal(res.data.pagination.total);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [loadCursor, debouncedPriceLimit, sortBy, debouncedSearch]);

  const formattedProducts = useMemo(() => {
    return products.map((p) => {
      let badge = null;
      if (p.isFeatured) badge = { text: "HOT", tone: "brand" };
      else if (p.compareAtPrice > p.price) {
        badge = {
          text: `SALE -${Math.round((1 - p.price / p.compareAtPrice) * 100)}%`,
          tone: "green",
        };
      }

      const outOfStock = (p.totalStock ?? 0) === 0;
      const defaultVariant =
        p.variants?.find((variant) => variant.stock > 0) || p.variants?.[0];

      return {
        _id: p._id,
        id: p.slug,
        title: p.name,
        category: p.category?.slug,
        categoryLabel: p.category?.name || "CLOTHING",
        price: p.price,
        badge,
        image: getImageUrl(p.images?.[0] || ""),
        isFeatured: p.isFeatured,
        compareAtPrice: p.compareAtPrice ?? 0,
        variants: p.variants ?? [],
        defaultVariant,
        totalStock: p.totalStock ?? 0,
        isOutOfStock: outOfStock,
        featured: p.isFeatured
          ? {
              pill: "HOT RELEASE",
              lead: outOfStock
                ? "HẾT HÀNG"
                : (p.totalStock ?? 0) <= 5
                  ? "HÀNG CÓ HẠN"
                  : "LIMITED STOCK",
              text: (p.description || "").substring(0, 50) + "...",
              cta: outOfStock ? "HẾT HÀNG" : "MUA NGAY",
            }
          : null,
      };
    });
  }, [products]);

  const filterKey = useMemo(
    () => `${debouncedPriceLimit}-${sortBy}-${debouncedSearch}`,
    [debouncedPriceLimit, sortBy, debouncedSearch],
  );

  const shown = formattedProducts.length;
  const canLoadMore = hasMore;
  const progress = total > 0 ? Math.min((shown / total) * 100, 100) : 0;

  return (
    <section className="w-full bg-[#f9f6f5]">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Default hero — /shop luôn hiển thị tất cả sản phẩm */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-4"
        >
          <div className="lg:col-span-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#94a3b8]">
              // SHOP - MENSWEAR
            </p>
            <h1 className="mt-4 font-heading text-6xl font-extrabold uppercase leading-[0.85] tracking-tight text-[#0f172a] sm:text-8xl md:text-[120px]">
              ALL <span className="text-[#004be3]">VIBES</span>
              <br />
              ALL <span className="text-[#004be3]">DROPS</span>
            </h1>
            <div className="mt-8 flex flex-col justify-between gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center">
              <p className="max-w-md text-sm text-[#334155]">
                Thời trang nam urban core — lọc theo danh mục, kích cỡ và
                bộ sưu tập ở thanh bên trái.
              </p>
              <button
                onClick={() => navigate("/lookbook")}
                className="whitespace-nowrap rounded-full bg-[#004be3] px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blue-700"
              >
                XEM LOOKBOOK <span className="ml-2">→</span>
              </button>
            </div>
          </div>

          <div className="pt-4 lg:col-span-1">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#94a3b8]">
              // LIVE STATS
            </p>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-black/5 pb-2 text-sm font-bold">
                <span className="text-[#334155]">ON STOCK</span>
                <span className="text-[#004be3]">{total} SẢN PHẨM</span>
              </div>
              <div className="flex justify-between border-b border-black/5 pb-2 text-sm font-bold">
                <span className="text-[#334155]">RESTOCK</span>
                <span className="text-[#004be3]">03 ngày</span>
              </div>
              <div className="flex justify-between border-b border-black/5 pb-2 text-sm font-bold">
                <span className="text-[#334155]">TOP MOVED</span>
                <span className="text-[#004be3]">VELOCITY 92</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr_240px]">
          {/* Left Sidebar */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#94a3b8]">
              // BỘ LỌC
            </p>
            <FilterSidebar
              activeCategory=""
              onCategoryChange={handleCategoryChange}
              priceLimit={priceLimit}
              onPriceLimitChange={setPriceLimit}
            />
          </div>

          {/* Center Grid */}
          <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full max-w-sm flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full border-b-2 border-black/10 bg-transparent py-2 pl-11 pr-10 text-sm font-medium text-[#2f2f2e] placeholder-[#94a3b8] outline-none transition focus:border-[#004be3]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] transition hover:text-[#2f2f2e]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#94a3b8]">
                SORT BY:
                <select
                  value={sortBy}
                  onChange={(event) => {
                    setSortBy(event.target.value);
                    setLoadCursor(null);
                  }}
                  className="border-b-2 border-[#004be3] bg-transparent pb-1 text-xs font-bold uppercase tracking-widest text-[#0f172a] outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <motion.div
              key={filterKey}
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 gap-5 md:grid-cols-3"
            >
              {formattedProducts.map((product, index) => {
                const isHero = index % 4 === 0;
                return (
                  <motion.div
                    key={product.id}
                    variants={fadeUpItem}
                    className={isHero ? "col-span-1 md:col-span-3" : "col-span-1"}
                  >
                    <ProductTile
                      product={product}
                      className={isHero ? "col-span-2" : ""}
                    />
                  </motion.div>
                );
              })}
            </motion.div>

            <div className="mt-14 flex flex-col items-center gap-6">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#94a3b8]">
                SHOWING {shown} OF {total} ITEMS
              </p>

              <div className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-[#eae7e7]">
                <div
                  className="h-full rounded-full bg-[#004be3] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <button
                type="button"
                onClick={() => setLoadCursor(nextCursor)}
                disabled={!canLoadMore}
                className="rounded-full border-2 border-[#0f172a] bg-transparent px-10 py-4 font-heading text-sm font-extrabold uppercase tracking-widest text-[#0f172a] transition hover:border-[#004be3] hover:text-[#004be3] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {canLoadMore ? "LOAD MORE VIBEZ" : "ALL ITEMS LOADED"}
              </button>
            </div>
          </div>

          {/* Right Sidebar — Quick Sort */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#94a3b8]">
              // SẮP XẾP
            </p>
            <div className="flex flex-col gap-3 lg:sticky lg:top-20">
              {QUICK_SORTS.map(({ value, label, sub, icon }) => {
                const isActive = sortBy === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setSortBy(value);
                      setLoadCursor(null);
                    }}
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
