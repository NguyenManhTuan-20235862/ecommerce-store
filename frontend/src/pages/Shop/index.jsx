import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
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

export default function Shop() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "",
  );
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceLimit, setPriceLimit] = useState(maxPrice);
  const [appliedPriceLimit, setAppliedPriceLimit] = useState(maxPrice);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      try {
        const apiLimit = page === 1 ? 8 : 4;
        const apiPage = page === 1 ? 1 : page + 1;

        const params = {
          page: apiPage,
          limit: apiLimit,
          category: activeCategory || undefined,
          size: selectedSizes.length > 0 ? selectedSizes.join(",") : undefined,
          maxPrice:
            appliedPriceLimit < maxPrice ? appliedPriceLimit : undefined,
          sort: sortBy,
          search: debouncedSearch || undefined,
        };
        const res = await productService.list(params);
        if (!cancelled && res.data) {
          const incoming = res.data.products;
          setProducts(
            page === 1
              ? incoming
              : (prev) => {
                  const existingIds = new Set(prev.map((p) => p._id));
                  const newProducts = incoming.filter(
                    (p) => !existingIds.has(p._id),
                  );
                  return [...prev, ...newProducts];
                },
          );
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
  }, [
    page,
    activeCategory,
    selectedSizes,
    appliedPriceLimit,
    sortBy,
    debouncedSearch,
  ]);

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

  const shown = formattedProducts.length;
  const canLoadMore = shown < total;
  const progress = total > 0 ? Math.min((shown / total) * 100, 100) : 0;

  return (
    <section className="w-full bg-[#f9f6f5]">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
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
                Phụ kiện và giày cho nam — bộ sưu tập urban core. Bộ lọc theo
                danh mục, kích cỡ và bộ sưu tập ở thanh dọc bên trái.
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
                <span className="text-[#004be3]">048 / 060</span>
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
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr_240px]">
          {/* Left Sidebar */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#94a3b8]">
              // BỘ LỌC
            </p>
            <FilterSidebar
              activeCategory={activeCategory}
              onCategoryChange={(categoryKey) => {
                setActiveCategory((prev) =>
                  prev === categoryKey ? "" : categoryKey,
                );
                setSelectedSizes([]);
                setPage(1);
              }}
              selectedSizes={selectedSizes}
              onSizeToggle={(size) => {
                setSelectedSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size],
                );
                setPage(1);
              }}
              priceLimit={priceLimit}
              onPriceLimitChange={setPriceLimit}
              onApply={() => {
                setAppliedPriceLimit(priceLimit);
                setPage(1);
              }}
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
                    setPage(1);
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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {formattedProducts.map((product, index) => (
                <ProductTile
                  key={product.id}
                  product={product}
                  className={index % 4 === 0 ? "md:col-span-2" : "col-span-1"}
                />
              ))}
            </div>

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
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!canLoadMore}
                className="rounded-full border-2 border-[#0f172a] bg-transparent px-10 py-4 font-heading text-sm font-extrabold uppercase tracking-widest text-[#0f172a] transition hover:border-[#004be3] hover:text-[#004be3] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {canLoadMore ? "LOAD MORE VIBEZ" : "ALL ITEMS LOADED"}
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#94a3b8]">
              // BỘ SƯU TẬP
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex h-16 items-center justify-center rounded-xl bg-[#ff1493] text-sm font-bold tracking-widest text-white hover:opacity-90 cursor-pointer transition">
                KINETIC PACK
              </div>
              <div className="flex h-16 items-center justify-center rounded-xl bg-[#1e293b] text-sm font-bold tracking-widest text-white hover:opacity-90 cursor-pointer transition">
                NIGHT FORMS
              </div>
              <div className="flex h-16 items-center justify-center rounded-xl bg-[#1e293b] text-sm font-bold tracking-widest text-white hover:opacity-90 cursor-pointer transition">
                CORE EVERYDAY
              </div>
            </div>

            <p className="mb-4 mt-10 text-xs font-bold uppercase tracking-widest text-[#94a3b8]">
              // SỐ LƯỢNG SẢN PHẨM
            </p>
            <div className="space-y-3 text-sm font-bold text-[#334155]">
              <div className="flex justify-between cursor-pointer hover:text-[#004be3] transition">
                <span>Sneakers</span>
                <span>6</span>
              </div>
              <div className="flex justify-between cursor-pointer hover:text-[#004be3] transition">
                <span>Túi Xách</span>
                <span>2</span>
              </div>
              <div className="flex justify-between cursor-pointer hover:text-[#004be3] transition">
                <span>Mũ</span>
                <span>3</span>
              </div>
              <div className="flex justify-between cursor-pointer hover:text-[#004be3] transition">
                <span>Kính mắt</span>
                <span>1</span>
              </div>
              <div className="flex justify-between cursor-pointer hover:text-[#004be3] transition">
                <span>Đồng hồ</span>
                <span>4</span>
              </div>
              <div className="flex justify-between cursor-pointer hover:text-[#004be3] transition">
                <span>Phụ kiện</span>
                <span>2</span>
              </div>
              <div className="flex justify-between cursor-pointer hover:text-[#004be3] transition">
                <span>Ví</span>
                <span>1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
