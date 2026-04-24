import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import FeaturedProductTile from "./components/FeaturedProductTile";
import FilterSidebar from "./components/FilterSidebar";
import ProductTile from "./components/ProductTile";
import { maxPrice } from "./components/shopData";
import { productService } from "../../services/product.service";

const sortOptions = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const INITIAL_VISIBLE = 8;

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "",
  );
  const [selectedSizes, setSelectedSizes] = useState(["M"]);
  const [priceLimit, setPriceLimit] = useState(maxPrice);
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          limit: visibleCount,
          category: activeCategory || undefined,
          size: selectedSizes.length > 0 ? selectedSizes.join(",") : undefined,
          maxPrice: priceLimit < maxPrice ? priceLimit : undefined,
          sort: sortBy,
        };
        const res = await productService.list(params);
        if (res.data) {
          setProducts(res.data.products);
          setTotal(res.data.pagination.total);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [activeCategory, selectedSizes, priceLimit, sortBy, visibleCount]);

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

      return {
        id: p.slug,
        title: p.name,
        category: p.category?.slug,
        categoryLabel: p.category?.name || "CLOTHING",
        price: p.price,
        badge,
        image: p.images?.[0] || "",
        isFeatured: p.isFeatured,
        featured: p.isFeatured
          ? {
              pill: "HOT RELEASE",
              lead: "LIMITED STOCK",
              text: (p.description || "").substring(0, 50) + "...",
              cta: "MUA NGAY",
            }
          : null,
      };
    });
  }, [products]);

  const featuredProduct = formattedProducts.find((item) => item.isFeatured);
  const regularProducts = formattedProducts.filter((item) => !item.isFeatured);

  const shown = formattedProducts.length;
  const canLoadMore = shown < total;
  const progress = total > 0 ? Math.min((shown / total) * 100, 100) : 0;

  return (
    <section className="w-full bg-[#f9f6f5]">
      <div className="mx-auto w-full max-w-7xl lg:grid lg:grid-cols-[256px_1fr]">
        <div className="px-4 pb-6 pt-6 sm:px-6 lg:px-0 lg:pb-0 lg:pt-8">
          <FilterSidebar
            activeCategory={activeCategory}
            onCategoryChange={(categoryKey) => {
              setActiveCategory((prev) =>
                prev === categoryKey ? "" : categoryKey,
              );
              setVisibleCount(INITIAL_VISIBLE);
            }}
            selectedSizes={selectedSizes}
            onSizeToggle={(size) => {
              setSelectedSizes((prev) =>
                prev.includes(size)
                  ? prev.filter((item) => item !== size)
                  : [...prev, size],
              );
            }}
            priceLimit={priceLimit}
            onPriceLimitChange={setPriceLimit}
            onApply={() => setVisibleCount(INITIAL_VISIBLE)}
          />
        </div>

        <div className="px-4 pb-12 pt-6 sm:px-6 lg:p-12">
          <div className="flex flex-col gap-5 border-b border-black/5 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-widest text-[#004be3]">
                Urban Core / SS24
              </p>
              <h1 className="m-0 font-heading text-5xl font-extrabold uppercase leading-[0.92] tracking-[-0.05em] text-[#0f172a] sm:text-6xl lg:text-8xl">
                ALL VIBES
                <br />/ ALL DROPS
              </h1>
            </div>

            <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#94a3b8]">
              SORT BY:
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
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

          <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {regularProducts.slice(0, 2).map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}

            {featuredProduct ? (
              <FeaturedProductTile product={featuredProduct} />
            ) : null}

            {regularProducts.slice(2).map((product) => (
              <ProductTile key={product.id} product={product} />
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
              onClick={() => setVisibleCount((prev) => prev + 4)}
              disabled={!canLoadMore}
              className="rounded-full border-2 border-[#0f172a] bg-white px-10 py-4 font-heading text-sm font-extrabold uppercase tracking-widest text-[#0f172a] transition hover:border-[#004be3] hover:text-[#004be3] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {canLoadMore ? "LOAD MORE VIBEZ" : "ALL ITEMS LOADED"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
