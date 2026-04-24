import { Circle, Dot } from "lucide-react";

export default function DeliveryProtocol({
  shippingMethods,
  selectedShipping,
  onSelectShipping,
  formatVnd,
}) {
  return (
    <section className="space-y-6">
      <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] text-[#2f2f2e]">
        Delivery Protocol
      </h2>

      {shippingMethods.map((method) => {
        const isActive = selectedShipping === method.value;

        return (
          <button
            key={method.value}
            type="button"
            onClick={() => onSelectShipping(method.value)}
            className={`flex w-full items-center justify-between rounded-xl border-2 px-5 py-5 text-left transition ${
              isActive
                ? "border-[#004be3] bg-white"
                : "border-transparent bg-[#f3f0ef]"
            }`}
          >
            <div className="flex items-center gap-4">
              {isActive ? (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#004be3] text-white">
                  <Dot className="h-5 w-5" />
                </span>
              ) : (
                <Circle className="h-5 w-5 text-[#787676]" />
              )}
              <span>
                <span className="block text-base font-semibold text-[#2f2f2e]">
                  {method.title}
                </span>
                <span className="block text-sm text-[#5c5b5b]">
                  {method.eta}
                </span>
              </span>
            </div>
            <span
              className={`text-base font-extrabold ${
                isActive ? "text-[#004be3]" : "text-[#2f2f2e]"
              }`}
            >
              {formatVnd(method.fee)}
            </span>
          </button>
        );
      })}
    </section>
  );
}
