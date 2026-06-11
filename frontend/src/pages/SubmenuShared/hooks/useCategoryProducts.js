import { useEffect, useMemo, useState } from "react";
import { productService } from "../../../services/product.service";
import { getImageUrl } from "../../../utils/getImageUrl";
import { maxPrice } from "../../Shop/components/shopData";
import { CATEGORY_CONFIGS } from "../components/categoryConfigs";

export function useCategoryProducts(categorySlug) {
  const [priceLimit, setPriceLimit] = useState(maxPrice);
  const [debouncedPriceLimit, setDebouncedPriceLimit] = useState(maxPrice);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [products, setProducts] = useState([]);
  const [loadCursor, setLoadCursor] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  // Reset toàn bộ state khi đổi category (navigate giữa /shop/ao ↔ /shop/quan)
  useEffect(() => {
    setLoadCursor(null);
    setPriceLimit(maxPrice);
    setDebouncedPriceLimit(maxPrice);
    setSortBy("newest");
    setSearchQuery("");
    setDebouncedSearch("");
  }, [categorySlug]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setLoadCursor(null);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Debounce price slider
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceLimit(priceLimit);
      setLoadCursor(null);
    }, 400);
    return () => clearTimeout(timer);
  }, [priceLimit]);

  // Fetch products
  useEffect(() => {
    if (!categorySlug) return;
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        const config = CATEGORY_CONFIGS[categorySlug];
        const categoryParam = config?.categories
          ? config.categories.join(",")
          : categorySlug;

        const params = {
          cursor: loadCursor || undefined,
          limit: 8,
          category: categoryParam,
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
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [loadCursor, categorySlug, debouncedPriceLimit, sortBy, debouncedSearch]);

  // Format products cho ProductTile
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
      const defaultVariant = p.variants?.find((v) => v.stock > 0) || p.variants?.[0];

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
    () => `${categorySlug}-${debouncedPriceLimit}-${sortBy}-${debouncedSearch}`,
    [categorySlug, debouncedPriceLimit, sortBy, debouncedSearch],
  );

  function handleSortChange(val) {
    setSortBy(val);
    setLoadCursor(null);
  }

  return {
    priceLimit,
    setPriceLimit,
    sortBy,
    handleSortChange,
    searchQuery,
    setSearchQuery,
    formattedProducts,
    total,
    hasMore,
    nextCursor,
    filterKey,
    loadMore: () => setLoadCursor(nextCursor),
  };
}
