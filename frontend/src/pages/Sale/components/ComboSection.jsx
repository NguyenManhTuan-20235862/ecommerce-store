import { useEffect, useState } from "react";
import { Link } from "react-router";
import { comboService } from "../../../services/combo.service";
import { formatCurrency } from "../../../utils/formatCurrency";
import { getImageUrl } from "../../../utils/getImageUrl";

function ComboCard({ combo }) {
  const products = combo.products ?? [];
  const originalTotal = products.reduce((sum, p) => sum + (p.product?.price ?? 0), 0);
  const savings = originalTotal - combo.comboPrice;

  return (
    <div className="bg-white border border-black/10 rounded-3xl p-6 flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          {combo.subtitle && (
            <p className="text-[10px] font-medium text-[#5c5b5b] mb-1">{combo.subtitle}</p>
          )}
          <p className="text-xl font-bold text-[#0f172a]">{combo.name}</p>
        </div>
        {savings > 0 && (
          <div className="border border-black/10 px-3 py-1 rounded-lg text-center shrink-0 ml-3">
            <p className="text-[8px] uppercase tracking-widest text-[#94a3b8] font-bold mb-0.5">Tiết kiệm</p>
            <p className="text-xs font-bold text-[#0f172a]">{formatCurrency(savings)}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-6">
        {products.map((item, i) => (
          <div key={item._id ?? i} className="contents">
            {i > 0 && <span className="font-extrabold text-[#0f172a] shrink-0">+</span>}
            <div className="flex-1 aspect-square rounded-2xl overflow-hidden border border-black/5 bg-[#f3f0ef]">
              {item.product?.images?.[0] ? (
                <img
                  src={getImageUrl(item.product.images[0])}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#94a3b8]">
                  {item.label || item.product?.name?.slice(0, 8) || "PRODUCT"}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-4">
        <div className="flex flex-col">
          {originalTotal > combo.comboPrice && (
            <span className="text-[10px] line-through text-[#94a3b8]">{formatCurrency(originalTotal)}</span>
          )}
          <span className="font-bold text-lg text-[#0f172a]">{formatCurrency(combo.comboPrice)}</span>
        </div>
        {products.length > 0 && products[0].product?.slug && (
          <Link
            to={`/product/${products[0].product.slug}`}
            className="bg-[#0f172a] text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black transition"
          >
            Xem combo
          </Link>
        )}
      </div>
    </div>
  );
}

export default function ComboSection() {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    comboService.getAll()
      .then((res) => setCombos(res.data.data || []))
      .catch(() => setCombos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (combos.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-8">
        <div>
          <div className="inline-block border border-black/10 bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-[#0f172a] mb-4 rounded-full">
            COMBO TIẾT KIỆM
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#0f172a]">
            Mua cặp, đỡ <span className="italic font-serif lowercase text-[#004be3]">nghĩ.</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {combos.map((combo) => (
          <ComboCard key={combo._id} combo={combo} />
        ))}
      </div>
    </section>
  );
}
