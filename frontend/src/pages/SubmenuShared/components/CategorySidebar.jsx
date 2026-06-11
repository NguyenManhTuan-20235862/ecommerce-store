import { maxPrice } from "../../Shop/components/shopData";
import { CATEGORY_CONFIGS } from "./categoryConfigs";

function formatPriceCompact(value) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

export default function CategorySidebar({
  categorySlug,
  searchQuery,
  onTagChange,
  priceLimit,
  onPriceLimitChange,
}) {
  const config = CATEGORY_CONFIGS[categorySlug];

  return (
    <aside className="space-y-3 lg:sticky lg:top-20">
      {/* Style tags */}
      <div className="rounded-2xl bg-[#f3f0ef] p-5">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
          // PHONG CÁCH
        </p>
        <div className="flex flex-wrap gap-2">
          {config?.styleTags?.map((tag) => {
            const isActive = searchQuery === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onTagChange(isActive ? "" : tag)}
                className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? "bg-[#004be3] text-white"
                    : "border border-black/10 bg-white text-[#5c5b5b] hover:border-[#004be3]/30 hover:bg-[#004be3]/10 hover:text-[#004be3]"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Clear tag hint */}
        {searchQuery && config?.styleTags?.includes(searchQuery) && (
          <button
            type="button"
            onClick={() => onTagChange("")}
            className="mt-3 text-[9px] font-bold uppercase tracking-widest text-[#94a3b8] transition hover:text-[#004be3]"
          >
            Xóa lọc ×
          </button>
        )}
      </div>

      {/* Price range */}
      <div className="rounded-2xl bg-[#f3f0ef] p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
            // KHOẢNG GIÁ
          </p>
          {priceLimit < maxPrice && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#004be3]">
              Đang lọc
            </span>
          )}
        </div>

        <input
          type="range"
          min={0}
          max={maxPrice}
          step={50000}
          value={priceLimit}
          onChange={(e) => onPriceLimitChange(Number(e.target.value))}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#dfdcdc] accent-[#004be3]"
        />
        <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-[#5c5b5b]">
          <span>0đ</span>
          <span className={priceLimit < maxPrice ? "text-[#004be3]" : ""}>
            {priceLimit < maxPrice
              ? `≤ ${formatPriceCompact(priceLimit)}`
              : "Tất cả mức giá"}
          </span>
        </div>

        {priceLimit < maxPrice && (
          <button
            type="button"
            onClick={() => onPriceLimitChange(maxPrice)}
            className="mt-3 text-[9px] font-bold uppercase tracking-widest text-[#94a3b8] transition hover:text-[#004be3]"
          >
            Xóa lọc ×
          </button>
        )}
      </div>

      {/* Info card */}
      <div className="rounded-2xl border border-[#004be3]/15 bg-[#004be3]/5 p-5">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-[#004be3]/60">
          // VIBE TIP
        </p>
        <p className="text-[11px] leading-relaxed text-[#2f2f2e]/60">
          Dùng thanh tìm kiếm hoặc kéo giá để lọc nhanh. Bấm tag phong cách bên trên để thu hẹp kết quả.
        </p>
      </div>
    </aside>
  );
}
