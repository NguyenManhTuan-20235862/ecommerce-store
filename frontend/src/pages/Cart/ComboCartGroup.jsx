import { Minus, Plus, Trash2 } from "lucide-react";
import { getImageUrl } from "../../utils/getImageUrl";
import { formatVND } from "./cartUtils";

export default function ComboCartGroup({ group, onQuantityChange, onRemove, onRemoveGroup }) {
  const { comboGroupId, comboName, items } = group;

  const comboTotal   = items.reduce((s, i) => s + i.price         * i.quantity, 0);
  const originalTotal = items.reduce((s, i) => s + (i.originalPrice ?? i.price) * i.quantity, 0);
  const savings = originalTotal - comboTotal;

  return (
    <article className="rounded-xl overflow-hidden border border-black/10 bg-white">
      {/* Header combo */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#0f172a]">
        <div>
          <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold block mb-0.5">
            COMBO TIẾT KIỆM
          </span>
          <p className="text-sm font-bold text-white leading-tight">{comboName}</p>
        </div>
        <div className="flex items-center gap-5">
          {savings > 0 && (
            <div className="text-right">
              <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold mb-0.5">
                Tiết kiệm
              </p>
              <p className="text-xs font-bold text-[#819bff]">{formatVND(savings)}</p>
            </div>
          )}
          <button
            onClick={() => onRemoveGroup(comboGroupId)}
            className="text-white/40 hover:text-white transition"
            title="Xóa toàn bộ combo"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="divide-y divide-black/5">
        {items.map((item) => (
          <div key={item.cartItemId} className="flex items-center gap-4 px-5 py-4">
            {/* Ảnh */}
            <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-[#f3f0ef]">
              <img
                src={getImageUrl(item.image)}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>

            {/* Tên + tags */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#2f2f2e] truncate leading-tight mb-1.5">
                {item.title}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className="rounded-full bg-[#f3f0ef] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#5c5b5b]">
                  {item.size}
                </span>
                <span className="rounded-full bg-[#f3f0ef] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#5c5b5b]">
                  {item.color}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                {item.originalPrice != null && item.originalPrice > item.price && (
                  <span className="text-[10px] line-through text-[#94a3b8]">
                    {formatVND(item.originalPrice)}
                  </span>
                )}
                <span className="text-sm font-bold text-[#004be3]">
                  {formatVND(item.price)}
                </span>
              </div>
            </div>

            {/* Quantity + xóa */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className="inline-flex items-center rounded-full border border-black/10 bg-[#f3f0ef] p-0.5">
                <button
                  onClick={() => onQuantityChange(item.cartItemId, item.quantity - 1)}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[#2f2f2e] transition hover:bg-black/5"
                >
                  <Minus size={10} />
                </button>
                <span className="w-6 text-center text-xs font-bold text-[#2f2f2e]">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onQuantityChange(item.cartItemId, item.quantity + 1)}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[#2f2f2e] transition hover:bg-black/5"
                >
                  <Plus size={10} />
                </button>
              </div>
              <button
                onClick={() => onRemove(item.cartItemId)}
                className="text-[10px] font-medium text-[#94a3b8] transition hover:text-[#2f2f2e]"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer tổng combo */}
      <div className="flex items-center justify-between border-t border-black/5 bg-[#f9f6f5] px-5 py-3">
        <span className="text-[10px] uppercase tracking-wide text-[#94a3b8]">
          Tổng combo · {items.length} sản phẩm
        </span>
        <div className="flex items-baseline gap-2">
          {savings > 0 && (
            <span className="text-[10px] line-through text-[#94a3b8]">
              {formatVND(originalTotal)}
            </span>
          )}
          <span className="text-sm font-bold text-[#2f2f2e]">{formatVND(comboTotal)}</span>
        </div>
      </div>
    </article>
  );
}
