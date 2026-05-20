import { Truck, RotateCcw, Star, Gift } from "lucide-react";

export default function PerksSection() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pb-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-black/10 p-4 rounded-2xl flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-[#f3f0ef] flex items-center justify-center text-[#004be3]">
            <Truck size={18} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-[#0f172a]">Miễn phí ship</p>
            <p className="text-[10px] text-[#5c5b5b]">Đơn từ 1.000.000đ</p>
          </div>
        </div>
        <div className="bg-white border border-black/10 p-4 rounded-2xl flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-[#f3f0ef] flex items-center justify-center text-[#004be3]">
            <RotateCcw size={18} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-[#0f172a]">Đổi size 7 ngày</p>
            <p className="text-[10px] text-[#5c5b5b]">Chưa dùng còn nguyên seal</p>
          </div>
        </div>
        <div className="bg-white border border-black/10 p-4 rounded-2xl flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-[#f3f0ef] flex items-center justify-center text-[#004be3]">
            <Star size={18} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-[#0f172a]">2x điểm member</p>
            <p className="text-[10px] text-[#5c5b5b]">Cộng dồn với mọi mã</p>
          </div>
        </div>
        <div className="bg-white border border-black/10 p-4 rounded-2xl flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-[#f3f0ef] flex items-center justify-center text-[#004be3]">
            <Gift size={18} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-[#0f172a]">Quà sinh nhật</p>
            <p className="text-[10px] text-[#5c5b5b]">Voucher 22% trong tháng</p>
          </div>
        </div>
      </div>
    </section>
  );
}
