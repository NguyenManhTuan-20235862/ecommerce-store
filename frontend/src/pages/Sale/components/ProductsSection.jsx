import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fadeUpItem, scrollFadeUp, staggerContainer } from "../../../animations/variants";
import { categoryService } from "../../../services/category.service";
import { productService } from "../../../services/product.service";
import { formatCurrency } from "../../../utils/formatCurrency";
import { getImageUrl } from "../../../utils/getImageUrl";

const DISPLAY_STEP = 8;

const sortByStock = (list) =>
  [...list].sort((a, b) => {
    const sa = a.totalStock ?? 0;
    const sb = b.totalStock ?? 0;
    if (sa === 0 && sb > 0) return 1;
    if (sb === 0 && sa > 0) return -1;
    return sa - sb;
  });

export default function ProductsSection() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(""); // "" = tất cả
  const [allProducts, setAllProducts] = useState([]);
  const [displayCount, setDisplayCount] = useState(DISPLAY_STEP);
  const [loading, setLoading] = useState(true);

  // Fetch categories một lần
  useEffect(() => {
    categoryService
      .list()
      .then((res) => setCategories(res.data.categories ?? []))
      .catch(() => {});
  }, []);

  // Fetch toàn bộ sản phẩm khi category thay đổi
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setDisplayCount(DISPLAY_STEP);
    productService
      .list({ limit: 200, category: activeCategory || undefined })
      .then((res) => {
        if (cancelled) return;
        setAllProducts(sortByStock(res.data?.products ?? []));
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [activeCategory]);

  const visibleProducts = allProducts.slice(0, displayCount);
  const canLoadMore = displayCount < allProducts.length;

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-8">
      <motion.div
        {...scrollFadeUp}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
      >
        <h2 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#2f2f2e]">
          Hàng giảm, hàng <span className="italic font-serif lowercase">hết.</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("")}
            className={`px-4 py-2 rounded-full border text-[11px] font-medium transition ${
              activeCategory === ""
                ? "bg-[#2f2f2e] text-white border-[#2f2f2e]"
                : "bg-[#f9f6f5] border-black/10 text-[#2f2f2e] hover:border-black/30"
            }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded-full border text-[11px] font-medium transition ${
                activeCategory === cat.slug
                  ? "bg-[#2f2f2e] text-white border-[#2f2f2e]"
                  : "bg-[#f9f6f5] border-black/10 text-[#2f2f2e] hover:border-black/30"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        key={`${activeCategory}-${allProducts.length}`}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {loading
          ? Array.from({ length: DISPLAY_STEP }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-[#e4e2e1] rounded-2xl mb-3" style={{ aspectRatio: "4/5" }} />
                <div className="h-3 bg-[#e4e2e1] rounded w-1/2 mb-2" />
                <div className="h-4 bg-[#e4e2e1] rounded w-3/4" />
              </div>
            ))
          : visibleProducts.map((p) => {
              const discountPct =
                p.compareAtPrice > p.price
                  ? Math.round((1 - p.price / p.compareAtPrice) * 100)
                  : null;
              const stock = p.totalStock ?? 0;
              const hot = stock > 0 && stock <= 5;
              const imgSrc = getImageUrl(p.images?.[0] ?? "");

              return (
                <motion.div key={p._id} variants={fadeUpItem}>
                  <Link to={`/product/${p.slug}`} className="group relative block">
                    <div
                      className="bg-[#e4e2e1] rounded-2xl relative overflow-hidden mb-3 border border-black/5"
                      style={{ aspectRatio: "4/5" }}
                    >
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={p.name}
                          className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#5c5b5b]">
                          ⊞ NO IMAGE
                        </div>
                      )}

                      {discountPct && (
                        <div className="absolute top-3 left-3 bg-[#2f2f2e] text-white w-10 h-10 rounded-full flex items-center justify-center">
                          <span className="text-[11px] font-extrabold leading-none">-{discountPct}%</span>
                        </div>
                      )}

                      <button
                        onClick={(e) => e.preventDefault()}
                        className="absolute top-3 right-3 bg-[#f9f6f5] w-8 h-8 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-[#2f2f2e] hover:bg-[#f3f0ef]"
                      >
                        <Heart size={14} />
                      </button>

                      {stock > 0 && (
                        <div className="absolute bottom-3 left-3 right-3 bg-[#f9f6f5]/90 backdrop-blur rounded-full px-3 py-1.5 flex items-center gap-2">
                          <span className="text-[8px] font-bold uppercase whitespace-nowrap text-[#5c5b5b]">
                            Còn {stock}
                          </span>
                          <div className="h-1 w-full bg-black/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${hot ? "bg-red-500" : "bg-[#004be3]"}`}
                              style={{ width: `${Math.min(100, stock * 5)}%` }}
                            />
                          </div>
                          {hot && (
                            <span className="text-[8px] font-bold uppercase text-red-500 whitespace-nowrap">
                              hot
                            </span>
                          )}
                        </div>
                      )}

                      {stock === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-[#f9f6f5] text-[#2f2f2e] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                            Hết hàng
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-[10px] text-[#5c5b5b] uppercase tracking-widest font-bold mb-1">
                        {p.category?.name ?? ""}
                      </p>
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-sm text-[#2f2f2e] truncate">{p.name}</p>
                        <div className="flex flex-col items-end shrink-0">
                          {p.compareAtPrice > p.price && (
                            <span className="text-[9px] line-through text-[#5c5b5b]/60">
                              {formatCurrency(p.compareAtPrice)}
                            </span>
                          )}
                          <span className="font-bold text-sm text-[#004be3]">
                            {formatCurrency(p.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
      </motion.div>

      <div className="mt-12 flex flex-col items-center justify-center">
        <p className="text-[11px] font-medium text-[#5c5b5b] mb-4">
          Đang xem {Math.min(displayCount, allProducts.length)} / {allProducts.length} sản phẩm
        </p>
        {canLoadMore && (
          <button
            onClick={() => setDisplayCount((c) => c + DISPLAY_STEP)}
            className="bg-[#2f2f2e] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition rounded-full"
          >
            XEM THÊM SẢN PHẨM
          </button>
        )}
      </div>
    </section>
  );
}
