import { Zap } from "lucide-react";

export default function VelocityManifest({
  manifestItems,
  subtotal,
  shippingFee,
  tax,
  total,
  formatVnd,
}) {
  return (
    <aside className="lg:col-span-5">
      <div className="rounded-3xl bg-[#f3f0ef] p-8 shadow-sm lg:sticky lg:top-24">
        <h3 className="font-heading text-3xl font-extrabold uppercase tracking-[-0.04em] text-[#2f2f2e]">
          Velocity Manifest
        </h3>

        <div className="mt-8 space-y-6">
          {manifestItems.map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-xl bg-[#dfdcdc]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold uppercase text-[#2f2f2e]">
                  {item.title}
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-[#5c5b5b]">
                  {item.variant}
                </p>
                <p className="mt-1 text-xl font-extrabold text-[#004be3]">
                  {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-black/10 pt-8">
          <div className="space-y-4 text-sm font-semibold uppercase tracking-widest text-[#5c5b5b]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-base normal-case tracking-normal">
                {formatVnd(subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-base normal-case tracking-normal">
                {formatVnd(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Urban Tax</span>
              <span className="text-base normal-case tracking-normal">
                {formatVnd(tax)}
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between border-t border-black/10 pt-4">
            <p className="w-38.75 font-heading text-3xl font-extrabold italic uppercase leading-[0.95] tracking-[-0.03em] text-[#2f2f2e]">
              <span className="block">Total</span>
              <span className="block">Velocity</span>
            </p>
            <p className="whitespace-nowrap font-heading text-[34px] font-extrabold text-[#004be3]">
              {formatVnd(total)}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="mt-6 inline-flex h-17 w-full items-center justify-center gap-3 rounded-full bg-[linear-gradient(135deg,#004be3_0%,#819bff_100%)] px-6 text-lg font-extrabold uppercase tracking-[-0.02em] text-white shadow-[0_10px_20px_rgba(0,75,227,0.2)]"
        >
          <Zap className="h-5 w-5" />
          Confirm Deployment
        </button>

        <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5c5b5b]/60">
          By deploying, you agree to the vibe protocol
        </p>
      </div>
    </aside>
  );
}
