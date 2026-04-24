import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { formatUSD } from "./cartUtils";

export default function CartSummary({
  subtotal,
  shipping,
  tax,
  total,
  couponCode,
  onCouponChange,
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-[0_12px_24px_rgba(0,75,227,0.08)] sm:p-8">
      {/* Header */}
      <div className="border-b border-[#eae7e7] pb-4.25">
        <h2 className="font-heading text-3xl font-extrabold uppercase tracking-[-0.03em] text-[#2f2f2e]">
          PULSE SUMMARY
        </h2>
      </div>

      {/* Order Breakdown */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#5c5b5b]">
            Subtotal
          </span>
          <span className="text-base text-[#5c5b5b]">
            {formatUSD(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#5c5b5b]">
            Standard Transit
          </span>
          <span className="text-base text-[#5c5b5b]">
            {formatUSD(shipping)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#5c5b5b]">
            Urban Tax
          </span>
          <span className="text-base text-[#5c5b5b]">{formatUSD(tax)}</span>
        </div>
      </div>

      {/* Coupon Code Section */}
      <div className="mt-8">
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#2f2f2e]">
          Access Code
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={couponCode || ""}
            onChange={(e) => onCouponChange(e.target.value)}
            placeholder="ENTER CODE"
            className="h-11 min-w-0 flex-1 rounded-full bg-[#f3f0ef] px-5 text-sm font-bold uppercase tracking-[0.08em] text-[#2f2f2e] outline-none placeholder:text-[#afadac]"
          />
          <button
            type="button"
            className="h-11 rounded-full bg-[#2f2f2e] px-5 text-xs font-bold uppercase tracking-[0.12em] text-[#f9f6f5] sm:shrink-0"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="mt-8 border-t-2 border-dashed border-[#eae7e7] pt-6">
        <div className="flex items-end justify-between gap-4">
          <span className="text-2xl font-bold italic uppercase tracking-[-0.04em] text-[#2f2f2e] sm:text-[28px] sm:leading-8">
            Total Velocity
          </span>
          <span className="font-body text-3xl font-bold leading-10 text-[#004be3] sm:text-4xl">
            {formatUSD(total)}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <Link
        to="/checkout"
        className="mt-8 inline-flex h-17 w-full items-center justify-center gap-3 rounded-full bg-[linear-gradient(90deg,#004be3_0%,#819bff_100%)] px-6 py-5 text-lg font-bold uppercase tracking-[0.12em] text-white shadow-[0_12px_24px_rgba(0,75,227,0.2)]"
      >
        Deploy Checkout
        <ArrowRight className="h-5 w-5" />
      </Link>
    </div>
  );
}
