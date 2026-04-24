import { Wallet } from "lucide-react";

export default function TransactionInterface({
  paymentMethods,
  selectedPayment,
  onSelectPayment,
}) {
  return (
    <section className="space-y-6">
      <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] text-[#2f2f2e]">
        Transaction Interface
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {paymentMethods.map((method) => {
          const isActive = selectedPayment === method.value;

          return (
            <button
              key={method.value}
              type="button"
              onClick={() => onSelectPayment(method.value)}
              className={`rounded-xl border-2 px-6 py-6 text-center transition ${
                isActive
                  ? "border-[#004be3] bg-white"
                  : "border-transparent bg-[#f3f0ef]"
              }`}
            >
              {method.type === "icon" ? (
                <Wallet className="mx-auto h-7 w-7 text-[#2f2f2e]" />
              ) : null}

              {method.type === "momo" ? (
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#ed178c] text-xs font-semibold text-white">
                  MOMO
                </span>
              ) : null}

              {method.type === "vnpay" ? (
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#004be3] text-[10px] font-semibold text-white">
                  VNPAY
                </span>
              ) : null}

              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#2f2f2e]">
                {method.label}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
