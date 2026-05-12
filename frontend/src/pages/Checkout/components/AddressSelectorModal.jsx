import { MapPin, Star, X } from "lucide-react";

export default function AddressSelectorModal({ addresses, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-[#5c5b5b] transition hover:bg-[#f3f0ef]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <MapPin className="h-6 w-6 text-[#004be3]" />
          <h2 className="font-heading text-2xl font-extrabold uppercase tracking-[-0.03em] text-[#2f2f2e]">
            Chọn địa chỉ giao hàng
          </h2>
        </div>

        <div className="space-y-3">
          {addresses.map((address) => (
            <button
              key={address._id}
              type="button"
              onClick={() => onSelect(address)}
              className={`w-full rounded-2xl border-2 p-4 text-left transition hover:border-[#004be3] hover:bg-[#004be3]/5 ${
                address.isDefault ? "border-[#004be3] bg-[#004be3]/5" : "border-[#e4e2e1] bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="flex-1 text-sm font-semibold text-[#2f2f2e]">
                  {address.detail}, {address.ward}, {address.district}, {address.province}
                </p>
                {address.isDefault && (
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#004be3] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    <Star className="h-3 w-3 fill-white" />
                    Mặc định
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
