import { motion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fadeUpItem, scrollFadeUp, staggerContainer } from "../../../animations/variants";
import * as cartService from "../../../services/cartService";
import { comboService } from "../../../services/combo.service";
import { useAuthStore } from "../../../store/authStore";
import { useCartStore } from "../../../store/cartStore";
import { formatCurrency } from "../../../utils/formatCurrency";
import { getImageUrl } from "../../../utils/getImageUrl";

// ── Helpers ────────────────────────────────────────────────────────────────

function initSelections(products) {
  return Object.fromEntries(
    (products ?? [])
      .filter((item) => item.product?._id)
      .map((item) => {
        const v = (item.product.variants ?? [])[0];
        return [item.product._id, { size: v?.size ?? "", color: v?.color ?? "" }];
      }),
  );
}

function uniqueSizes(variants) {
  return [...new Set((variants ?? []).map((v) => v.size))];
}

function uniqueColors(variants) {
  const seen = new Set();
  return (variants ?? []).reduce((acc, v) => {
    if (!seen.has(v.color)) {
      seen.add(v.color);
      acc.push({ color: v.color, colorHex: v.colorHex });
    }
    return acc;
  }, []);
}

// ── ProductRow (inside modal) ──────────────────────────────────────────────

function ProductRow({ item, selection, onChange }) {
  const p = item.product;
  if (!p) return null;

  const sizes = uniqueSizes(p.variants);
  const colors = uniqueColors(p.variants);

  return (
    <div className="flex gap-4 py-5 border-b border-black/5 last:border-0">
      {/* Ảnh */}
      <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-[#f3f0ef] border border-black/5">
        {p.images?.[0] ? (
          <img
            src={getImageUrl(p.images[0])}
            alt={p.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-[#5c5b5b] text-center px-2">
            {item.label?.slice(0, 8) || "PRODUCT"}
          </div>
        )}
      </div>

      {/* Thông tin */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-[#5c5b5b] font-medium uppercase tracking-wider mb-0.5">
          {item.label}
        </p>
        <p className="font-semibold text-[#2f2f2e] text-sm mb-1 truncate">{p.name}</p>
        <p className="text-sm font-bold text-[#004be3] mb-3">{formatCurrency(p.price)}</p>

        {/* Size */}
        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {sizes.map((sz) => (
              <button
                key={sz}
                onClick={() => onChange(p._id, "size", sz)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition ${
                  selection?.size === sz
                    ? "bg-[#2f2f2e] text-white border-[#2f2f2e]"
                    : "bg-[#f9f6f5] text-[#5c5b5b] border-black/15 hover:border-black/30"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        )}

        {/* Màu */}
        {colors.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {colors.map(({ color, colorHex }) => (
              <button
                key={color}
                title={color}
                onClick={() => onChange(p._id, "color", color)}
                className={`w-5 h-5 rounded-full border-2 transition shrink-0 ${
                  selection?.color === color
                    ? "border-[#2f2f2e] scale-110"
                    : "border-transparent hover:border-black/30"
                }`}
                style={{ backgroundColor: colorHex || "#e4e2e1" }}
              />
            ))}
            {selection?.color && (
              <span className="text-[10px] text-[#5c5b5b]">{selection.color}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── ComboDetailModal ────────────────────────────────────────────────────────

function ComboDetailModal({ combo, onClose }) {
  const [selections, setSelections] = useState(() => initSelections(combo.products ?? []));
  const [adding, setAdding] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handleChange = (productId, field, value) => {
    setSelections((prev) => ({
      ...prev,
      [productId]: { ...(prev[productId] ?? {}), [field]: value },
    }));
  };

  const handleAddAll = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để mua combo");
      return;
    }

    setAdding(true);

    const validProducts = (combo.products ?? []).filter((item) => item.product?._id);
    const originalTotal = validProducts.reduce((sum, item) => sum + (item.product.price ?? 0), 0);
    const comboGroupId = `combo_${combo._id}_${Date.now()}`;

    let proratedSum = 0;
    let ok = 0;

    for (let i = 0; i < validProducts.length; i++) {
      const item = validProducts[i];
      const p = item.product;
      const sel = selections[p._id] ?? {};
      const isLast = i === validProducts.length - 1;

      // Phân bổ giá combo theo tỷ lệ, item cuối lấy phần còn lại để tránh lỗi làm tròn
      const proratedPrice = isLast
        ? combo.comboPrice - proratedSum
        : Math.round((p.price / originalTotal) * combo.comboPrice);
      if (!isLast) proratedSum += proratedPrice;

      try {
        const res = await cartService.addToCartAPI({
          productId: p._id,
          quantity: 1,
          selectedSize: sel.size || "M",
          selectedColor: sel.color || "",
          price: proratedPrice,
          comboGroupId,
          comboName: combo.name,
          originalPrice: p.price,
        });
        if (res.success) ok++;
        else toast.error(res.message || `Lỗi khi thêm "${item.label}"`);
      } catch (err) {
        toast.error(err.response?.data?.message || `Không thể thêm "${item.label}"`);
      }
    }

    useCartStore.getState().fetchCart();
    setAdding(false);

    if (ok > 0) {
      toast.success(`Đã thêm ${ok} sản phẩm vào giỏ hàng`);
      if (ok === validProducts.length) onClose();
    }
  };

  const products = combo.products ?? [];
  const originalTotal = products.reduce((sum, p) => sum + (p.product?.price ?? 0), 0);
  const savings = originalTotal - combo.comboPrice;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#f9f6f5] w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-black/5 shrink-0">
          <div>
            {combo.subtitle && (
              <p className="text-[10px] font-medium text-[#5c5b5b] uppercase tracking-widest mb-1">
                {combo.subtitle}
              </p>
            )}
            <h3 className="text-xl font-bold text-[#2f2f2e]">{combo.name}</h3>
          </div>
          <div className="flex items-center gap-4 ml-4 shrink-0">
            {savings > 0 && (
              <div className="text-right">
                <p className="text-[8px] uppercase tracking-widest text-[#5c5b5b] font-bold mb-0.5">
                  Tiết kiệm
                </p>
                <p className="text-sm font-bold text-[#004be3]">{formatCurrency(savings)}</p>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#5c5b5b] hover:bg-[#f3f0ef] hover:text-[#2f2f2e] transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="overflow-y-auto px-6 flex-1">
          {products.map((item, i) => (
            <ProductRow
              key={item._id ?? i}
              item={item}
              selection={selections[item.product?._id]}
              onChange={handleChange}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-black/5 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            {originalTotal > combo.comboPrice && (
              <span className="text-[10px] line-through text-[#5c5b5b]">
                {formatCurrency(originalTotal)}
              </span>
            )}
            <span className="text-xl font-extrabold text-[#2f2f2e]">
              {formatCurrency(combo.comboPrice)}
            </span>
            <span className="text-[10px] text-[#5c5b5b] mt-0.5">
              Giá trọn combo · {products.length} sản phẩm
            </span>
          </div>
          <button
            onClick={handleAddAll}
            disabled={adding}
            className="flex items-center gap-2 bg-[#2f2f2e] text-white px-5 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:brightness-110 transition disabled:opacity-60"
          >
            <ShoppingBag size={14} />
            {adding ? "Đang thêm..." : "Thêm tất cả vào giỏ"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ComboCard ───────────────────────────────────────────────────────────────

function ComboCard({ combo, onOpen }) {
  const products = combo.products ?? [];
  const originalTotal = products.reduce((sum, p) => sum + (p.product?.price ?? 0), 0);
  const savings = originalTotal - combo.comboPrice;

  return (
    <div className="bg-[#f9f6f5] rounded-3xl p-6 flex flex-col">
      {/* Tiêu đề */}
      <div className="flex justify-between items-start mb-6">
        <div>
          {combo.subtitle && (
            <p className="text-[10px] font-medium text-[#5c5b5b] mb-1">{combo.subtitle}</p>
          )}
          <p className="text-xl font-bold text-[#2f2f2e]">{combo.name}</p>
        </div>
        {savings > 0 && (
          <div className="border border-black/10 px-3 py-1 rounded-lg text-center shrink-0 ml-3">
            <p className="text-[8px] uppercase tracking-widest text-[#5c5b5b] font-bold mb-0.5">
              Tiết kiệm
            </p>
            <p className="text-xs font-bold text-[#2f2f2e]">{formatCurrency(savings)}</p>
          </div>
        )}
      </div>

      {/* Ảnh sản phẩm */}
      <div className="flex items-center gap-2 mb-6">
        {products.map((item, i) => (
          <div key={item._id ?? i} className="contents">
            {i > 0 && <span className="font-extrabold text-[#2f2f2e] shrink-0">+</span>}
            <div className="flex-1 aspect-square rounded-2xl overflow-hidden border border-black/5 bg-[#f3f0ef]">
              {item.product?.images?.[0] ? (
                <img
                  src={getImageUrl(item.product.images[0])}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#5c5b5b]">
                  {item.label?.slice(0, 8) || "PRODUCT"}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Labels sản phẩm */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {products.map((item, i) => (
          <span
            key={item._id ?? i}
            className="text-[9px] font-medium text-[#5c5b5b] bg-[#f3f0ef] rounded-full px-2 py-0.5"
          >
            {item.label || item.product?.name?.split(" ").slice(0, 3).join(" ")}
          </span>
        ))}
      </div>

      {/* Footer card */}
      <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-4">
        <div className="flex flex-col">
          {originalTotal > combo.comboPrice && (
            <span className="text-[10px] line-through text-[#5c5b5b]/60">
              {formatCurrency(originalTotal)}
            </span>
          )}
          <span className="font-bold text-lg text-[#2f2f2e]">
            {formatCurrency(combo.comboPrice)}
          </span>
        </div>
        <button
          onClick={() => onOpen(combo)}
          className="bg-[#2f2f2e] text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition"
        >
          Xem combo
        </button>
      </div>
    </div>
  );
}

// ── ComboSection ────────────────────────────────────────────────────────────

export default function ComboSection() {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCombo, setSelectedCombo] = useState(null);

  useEffect(() => {
    comboService
      .getAll()
      .then((res) => setCombos(res.data.data || []))
      .catch(() => setCombos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-[#e4e2e1] animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (combos.length === 0) return null;

  return (
    <>
      <section className="mx-auto w-full max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          {...scrollFadeUp}
          className="flex items-center justify-between border-b border-black/10 pb-4 mb-8"
        >
          <div>
            <div className="inline-block border border-black/10 bg-[#f9f6f5] px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-[#2f2f2e] mb-4 rounded-full">
              COMBO TIẾT KIỆM
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#2f2f2e]">
              Mua cặp, đỡ <span className="italic font-serif lowercase text-[#004be3]">nghĩ.</span>
            </h2>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {combos.map((combo) => (
            <motion.div key={combo._id} variants={fadeUpItem}>
              <ComboCard combo={combo} onOpen={setSelectedCombo} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {selectedCombo && (
        <ComboDetailModal
          combo={selectedCombo}
          onClose={() => setSelectedCombo(null)}
        />
      )}
    </>
  );
}
