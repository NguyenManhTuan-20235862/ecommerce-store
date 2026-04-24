export default function CheckoutProgress() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
      <span className="inline-flex items-center gap-2 text-[#004be3]">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#004be3] text-white">
          1
        </span>
        Shipping
      </span>
      <span className="h-0.5 w-12 bg-black/15" />
      <span className="inline-flex items-center gap-2 text-[#5c5b5b] opacity-60">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#dfdcdc] text-[#2f2f2e]">
          2
        </span>
        Payment
      </span>
      <span className="h-0.5 w-12 bg-black/15" />
      <span className="inline-flex items-center gap-2 text-[#5c5b5b] opacity-60">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#dfdcdc] text-[#2f2f2e]">
          3
        </span>
        Review
      </span>
    </div>
  );
}
