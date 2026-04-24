import { Gem, Shirt, ShoppingBag, Spline } from "lucide-react";
import { categoryFilters, maxPrice, sizeFilters } from "./shopData";

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
  selectedSizes,
  onSizeToggle,
  priceLimit,
  onPriceLimitChange,
  onApply,
}) {
  return (
    <aside className="h-fit rounded-3xl bg-[#f8fafc] p-6 lg:sticky lg:top-20">
      <section>
        <h2 className="m-0 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-[#0f172a]">
          Categories
        </h2>

        <div className="mt-5 space-y-2">
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
                    : "text-[#475569] hover:bg-white"
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
        <h3 className="m-0 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-[#0f172a]">
          Size / Fit
        </h3>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {sizeFilters.map((size) => {
            const isSelected = selectedSizes.includes(size);

            return (
              <button
                key={size}
                type="button"
                onClick={() => onSizeToggle(size)}
                className={`rounded-lg border px-2 py-2 text-xs font-bold transition ${
                  isSelected
                    ? "border-[#004be3] bg-[#004be3] text-white"
                    : "border-black/10 bg-white text-[#2f2f2e] hover:border-[#004be3]"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <h3 className="m-0 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-[#0f172a]">
          Price Range
        </h3>

        <div className="mt-5">
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={50000}
            value={priceLimit}
            onChange={(event) => onPriceLimitChange(Number(event.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#eae7e7] accent-[#004be3]"
          />
          <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-[#64748b]">
            <span>0đ</span>
            <span className="text-[#004be3]">
              {formatPriceCompact(priceLimit)}
            </span>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={onApply}
        className="mt-8 w-full rounded-full bg-[#0f172a] py-4 font-heading text-xs font-extrabold uppercase tracking-widest text-white transition hover:brightness-110"
      >
        Apply Filters
      </button>
    </aside>
  );
}
