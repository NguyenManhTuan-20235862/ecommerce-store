import { useEffect, useState } from "react";
import { toast } from "sonner";
import { couponService } from "../../../services/coupon.service";

const CARD_THEMES = [
  { bg: "bg-white", bodyBorder: "border-black/5", footerBg: "bg-[#f9f6f5]", textMain: "text-[#0f172a]", textSub: "text-[#5c5b5b]", textMuted: "text-[#94a3b8]", btnClass: "bg-[#0f172a] text-white hover:bg-black", codeColor: "text-[#0f172a]", gradient: "from-black/5" },
  { bg: "bg-[#004be3]", bodyBorder: "border-white/20", footerBg: "bg-black/20", textMain: "text-white", textSub: "text-white/80", textMuted: "text-white/60", btnClass: "bg-white text-[#0f172a] hover:bg-gray-100", codeColor: "text-white", gradient: "from-white/20" },
  { bg: "bg-[#f3f0ef]", bodyBorder: "border-black/5", footerBg: "bg-white/50", textMain: "text-[#0f172a]", textSub: "text-[#5c5b5b]", textMuted: "text-[#94a3b8]", btnClass: "bg-[#0f172a] text-white hover:bg-black", codeColor: "text-[#0f172a]", gradient: "from-black/5" },
  { bg: "bg-[#1e293b]", bodyBorder: "border-white/10", footerBg: "bg-black/20", textMain: "text-white", textSub: "text-white/80", textMuted: "text-white/60", btnClass: "bg-white text-[#0f172a] hover:bg-gray-100", codeColor: "text-white", gradient: "from-white/10" },
];

function formatDiscount(coupon) {
  if (coupon.discountType === "percent") return `-${coupon.discountValue}%`;
  return `${(coupon.discountValue / 1000).toFixed(0)}K`;
}

function CouponCard({ coupon, index }) {
  const theme = CARD_THEMES[index % CARD_THEMES.length];

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code).then(() => {
      toast.success(`Đã sao chép: ${coupon.code}`);
    });
  };

  return (
    <div className={`${theme.bg} border border-black/10 rounded-3xl overflow-hidden shadow-sm flex flex-col relative group`}>
      <div className={`absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l ${theme.gradient} to-transparent opacity-50 pointer-events-none rounded-l-[100px]`} />
      <div className={`p-8 flex-1 border-b ${theme.bodyBorder} border-dashed relative z-10`}>
        {coupon.minOrderValue > 0 && (
          <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted} mb-2`}>
            Từ {(coupon.minOrderValue / 1000).toFixed(0)}K
          </p>
        )}
        <p className={`text-6xl font-extrabold tracking-tighter ${theme.textMain} mb-2`}>
          {formatDiscount(coupon)}
        </p>
        {coupon.expiresAt && (
          <p className={`text-xs ${theme.textSub} font-medium`}>
            HSD: {new Date(coupon.expiresAt).toLocaleDateString("vi-VN")}
          </p>
        )}
      </div>
      <div className={`p-4 ${theme.footerBg} flex items-center justify-between`}>
        <div className="flex flex-col">
          <span className={`text-[9px] ${theme.textMuted} uppercase tracking-widest font-bold`}>Mã giảm giá</span>
          <span className={`font-bold text-sm ${theme.codeColor}`}>{coupon.code}</span>
        </div>
        <button
          onClick={handleCopy}
          className={`${theme.btnClass} px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition`}
        >
          SAO CHÉP
        </button>
      </div>
    </div>
  );
}

export default function CouponsSection() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    couponService.getPublic()
      .then((res) => setCoupons(res.data.data || []))
      .catch(() => setCoupons([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-52 rounded-3xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (coupons.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-block border border-black/10 bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-[#0f172a] mb-4 rounded-full">
            TEM GIẢM GIÁ • {String(coupons.length).padStart(2, "0")}
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#0f172a]">
            Bóc <span className="text-[#004be3] italic font-serif lowercase">tem</span>, dán vào <span className="text-[#004be3] italic font-serif lowercase">giỏ</span>.
          </h2>
        </div>
        <p className="text-[10px] text-[#5c5b5b] max-w-xs text-right hidden lg:block">
          Bấm "Sao chép" để lưu mã. Áp dụng ở thanh toán.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon, i) => (
          <CouponCard key={coupon._id} coupon={coupon} index={i} />
        ))}
      </div>
    </section>
  );
}
