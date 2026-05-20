import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router";
import { productService } from "../../../services/product.service";
import { getImageUrl } from "../../../utils/getImageUrl";

function formatVnd(n) {
  return new Intl.NumberFormat("vi-VN").format(n);
}

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const LIMIT = 8;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    productService
      .list({ sort: "price_asc", limit: LIMIT, page })
      .then((res) => {
        if (cancelled) return;
        const incoming = res.data?.products ?? [];
        setProducts((prev) => {
          if (page === 1) return incoming;
          const ids = new Set(prev.map((p) => p._id));
          return [...prev, ...incoming.filter((p) => !ids.has(p._id))];
        });
        setTotal(res.data?.pagination?.total ?? 0);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page]);

  const canLoadMore = products.length < total;

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <h2 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#0f172a]">
          Hàng giảm, hàng <span className="italic font-serif lowercase">hết.</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {['Tất cả', 'Flash 48h', 'Clearance', 'Miễn ship', 'Member'].map((f, i) => (
            <button key={i} className={`px-4 py-2 rounded-full border text-[11px] font-medium transition ${
              i === 0 ? 'bg-[#0f172a] text-white border-black' : 'bg-white border-black/10 text-[#0f172a] hover:border-black/30'
            }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p) => {
          const discountPct = p.compareAtPrice > p.price
            ? Math.round((1 - p.price / p.compareAtPrice) * 100)
            : null;
          const stock = p.totalStock ?? 0;
          const hot = stock > 0 && stock <= 5;
          const imgSrc = getImageUrl(p.images?.[0] ?? "");

          return (
            <Link key={p._id} to={`/product/${p.slug}`} className="group relative block">
              <div className="bg-[#e2e8f0] rounded-2xl relative overflow-hidden mb-3 border border-black/5" style={{ aspectRatio: '4/5' }}>
                {imgSrc ? (
                  <img src={imgSrc} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#94a3b8]">
                    ⊞ NO IMAGE
                  </div>
                )}

                {discountPct && (
                  <div className="absolute top-3 left-3 bg-[#0f172a] text-white w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-[11px] font-extrabold leading-none">-{discountPct}%</span>
                  </div>
                )}
                <button
                  onClick={(e) => e.preventDefault()}
                  className="absolute top-3 right-3 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-[#0f172a] hover:bg-gray-100"
                >
                  <Heart size={14} />
                </button>

                {stock > 0 && (
                  <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 flex items-center gap-2">
                    <span className="text-[8px] font-bold uppercase whitespace-nowrap text-[#5c5b5b]">Còn {stock}</span>
                    <div className="h-1 w-full bg-black/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${hot ? 'bg-red-500' : 'bg-[#004be3]'}`} style={{ width: `${Math.min(100, stock * 5)}%` }} />
                    </div>
                    {hot && <span className="text-[8px] font-bold uppercase text-red-500 whitespace-nowrap">hot</span>}
                  </div>
                )}

                {stock === 0 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white text-[#0f172a] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Hết hàng</span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-[10px] text-[#94a3b8] uppercase tracking-widest font-bold mb-1">
                  {p.category?.name ?? ""}
                </p>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-sm text-[#0f172a] truncate">{p.name}</p>
                  <div className="flex flex-col items-end shrink-0">
                    {p.compareAtPrice > p.price && (
                      <span className="text-[9px] line-through text-[#94a3b8]">{formatVnd(p.compareAtPrice)}đ</span>
                    )}
                    <span className="font-bold text-sm text-[#0f172a]">{formatVnd(p.price)}đ</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {loading && products.length === 0 &&
          Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-[#e2e8f0] rounded-2xl mb-3" style={{ aspectRatio: '4/5' }} />
              <div className="h-3 bg-[#e2e8f0] rounded w-1/2 mb-2" />
              <div className="h-4 bg-[#e2e8f0] rounded w-3/4" />
            </div>
          ))
        }
      </div>

      <div className="mt-12 flex flex-col items-center justify-center">
        <p className="text-[11px] font-medium text-[#5c5b5b] mb-4">
          Đang xem {products.length} / {total} sản phẩm
        </p>
        {canLoadMore && (
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            className="bg-[#0f172a] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black transition rounded-full disabled:opacity-50"
          >
            {loading ? "Đang tải..." : "XEM THÊM SẢN PHẨM"}
          </button>
        )}
      </div>
    </section>
  );
}
