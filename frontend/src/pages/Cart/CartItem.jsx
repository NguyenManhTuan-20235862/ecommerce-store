import { Minus, Plus, Trash2 } from "lucide-react";
import { formatUSD } from "./cartUtils";

export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <article
      className={`rounded-xl border-l-4 bg-[#f3f0ef] pb-4 pl-5 pr-4 pt-4 lg:min-h-72 ${
        item.accent || "border-[#004be3]"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        {/* Product Image */}
        <div className="h-48 w-full overflow-hidden rounded-xl bg-[#eae7e7] sm:h-64 sm:w-48 sm:shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full scale-[1.02] object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col justify-between py-2">
          <div className="space-y-2">
            {/* Title & Price */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-heading text-xl font-normal uppercase tracking-[-0.03em] text-[#2f2f2e] sm:text-2xl sm:leading-8">
                {item.title}
              </h3>
              <p className="font-body text-xl font-bold text-[#004be3] sm:text-2xl sm:leading-8">
                {formatUSD(item.price)}
              </p>
            </div>

            {/* Size & Color Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="h-6 rounded-full bg-[#dfdcdc] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#2f2f2e]">
                SIZE: {item.size}
              </span>
              <span className="h-6 rounded-full bg-[#dfdcdc] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#2f2f2e]">
                COLOR: {item.color}
              </span>
            </div>
          </div>

          {/* Quantity Controls & Remove Button */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Quantity Selector */}
            <div className="inline-flex h-10.5 items-center self-start rounded-full border border-black/10 bg-white p-1.25">
              <button
                type="button"
                onClick={() =>
                  onQuantityChange(item.productId, item.quantity - 1)
                }
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#2f2f2e] transition hover:bg-black/5"
                aria-label="Giảm số lượng"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="px-4 text-lg font-bold leading-7 text-[#2f2f2e]">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  onQuantityChange(item.productId, item.quantity + 1)
                }
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#2f2f2e] transition hover:bg-black/5"
                aria-label="Tăng số lượng"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => onRemove(item.productId)}
              className="inline-flex items-center gap-1.5 self-end text-xs font-bold uppercase tracking-widest text-[#5c5b5b] transition hover:text-[#2f2f2e] sm:self-auto"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
