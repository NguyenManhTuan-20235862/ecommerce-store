import { LayoutGrid, Gem, Shirt, ShoppingBag, Spline } from "lucide-react";
import { categoryFilters, maxPrice } from "./shopData";

const categoryIconMap = {
  shirt: Shirt,
  pants: Spline,
  shoe: ShoppingBag,
  gem: Gem,
};

function formatPriceCompact(value) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

export default function FilterSidebar({
  activeCategory,
  onCategoryChange,
  priceLimit,
  onPriceLimitChange,
}) {
  return (
    <aside className="h-fit rounded-3xl bg-[#f3f0ef] p-6 lg:sticky lg:top-20">
      <section>
        <h2 className="m-0 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-[#2f2f2e]">
          Danh mục
        </h2>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={() => onCategoryChange("")}
            className={`flex w-full items-center gap-3 rounded-full px-5 py-3 text-left text-xs font-bold uppercase tracking-widest transition ${
              activeCategory === ""
                ? "bg-[#004be3] text-white"
                : "text-[#5c5b5b] hover:bg-[#f9f6f5]"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Tất cả</span>
          </button>

          {categoryFilters.map((item) => {
            const isActive = activeCategory === item.key;
            const Icon = categoryIconMap[item.icon] || Gem;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onCategoryChange(item.key)}
                className={`flex w-full items-center gap-3 rounded-full px-5 py-3 text-left text-xs font-bold uppercase tracking-widest transition ${
                  isActive
                    ? "bg-[#004be3] text-white"
                    : "text-[#5c5b5b] hover:bg-[#f9f6f5]"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="m-0 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-[#2f2f2e]">
            Khoảng giá
          </h3>
          {priceLimit < maxPrice && (
            <span className="text-[9px] font-bold text-[#004be3] uppercase tracking-widest">
              Đang lọc
            </span>
          )}
        </div>

        <div>
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={50000}
            value={priceLimit}
            onChange={(event) => onPriceLimitChange(Number(event.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#dfdcdc] accent-[#004be3]"
          />
          <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-[#5c5b5b]">
            <span>0đ</span>
            <span className={priceLimit < maxPrice ? "text-[#004be3]" : "text-[#5c5b5b]"}>
              {priceLimit < maxPrice ? `≤ ${formatPriceCompact(priceLimit)}` : "Tất cả mức giá"}
            </span>
          </div>
        </div>
      </section>
    </aside>
  );
}
