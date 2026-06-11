import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fadeUpItem, scrollSlideLeft, staggerContainer } from "../../../animations/variants";
import { saleConfigService } from "../../../services/saleConfig.service";
import { formatCurrency } from "../../../utils/formatCurrency";

const FALLBACK_TIERS = [
  { label: "TIER 1", threshold: 500000, discountPercent: 5, perks: ["Tự động áp dụng"], order: 1 },
  { label: "TIER 2", threshold: 1500000, discountPercent: 12, perks: ["Miễn phí ship"], order: 2 },
  { label: "TIER 3", threshold: 3000000, discountPercent: 18, perks: ["Priority early-access"], order: 3 },
  { label: "TIER 4", threshold: 5000000, discountPercent: 22, perks: ["Invite-only studio sale"], order: 4 },
];

export default function TierSection() {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    saleConfigService
      .getTiers()
      .then((res) => {
        const data = res.data.data ?? [];
        const sorted = [...data].sort((a, b) => a.order - b.order);
        setTiers(sorted.length > 0 ? sorted : FALLBACK_TIERS);
      })
      .catch(() => setTiers(FALLBACK_TIERS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Dark Card */}
        <motion.div
          {...scrollSlideLeft}
          className="bg-[#2f2f2e] rounded-3xl p-8 sm:p-12 text-white flex flex-col relative overflow-hidden h-full min-h-[300px]"
        >
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#004be3] rounded-full opacity-50 blur-3xl" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="inline-block border border-white/20 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white mb-8 rounded-full self-start">
              BẬC THANG ƯU ĐÃI
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight mb-4 leading-none">
              Mua <span className="italic font-serif lowercase">nhiều</span>,<br />giảm sâu.
            </h2>
            <p className="text-xs text-white/70 max-w-xs mb-auto">
              Đơn càng lớn — % giảm càng cao. Tier tính theo tổng giỏ hàng.
            </p>
          </div>
        </motion.div>

        {/* Right Tiers List */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-60px" }}
          className="lg:col-span-2 flex flex-col gap-3"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-3xl bg-[#e4e2e1] animate-pulse" />
              ))
            : tiers.map((t, i) => (
                <motion.div
                  key={t._id ?? i}
                  variants={fadeUpItem}
                  className="flex items-center justify-between p-6 sm:p-8 rounded-3xl bg-[#f9f6f5]"
                >
                  <div className="flex items-center gap-6 sm:gap-12 w-full">
                    <div className="flex flex-col shrink-0">
                      <span className="text-[9px] uppercase tracking-widest text-[#5c5b5b] font-bold mb-1">
                        {t.label || `Tier ${i + 1}`} — từ
                      </span>
                      <span className="text-xl sm:text-2xl font-extrabold text-[#2f2f2e]">
                        {formatCurrency(t.threshold)}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm sm:text-base text-[#2f2f2e]">
                        {t.discountPercent > 0 ? `Giảm ${t.discountPercent}%` : "Không giảm"}
                      </span>
                      {t.perks?.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                          {t.perks.map((perk, pi) => (
                            <span key={pi} className="flex items-center gap-1 text-xs text-[#5c5b5b]">
                              <span className="h-1 w-1 shrink-0 rounded-full bg-[#5c5b5b]" />
                              {perk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {t.discountPercent > 0 && (
                    <div className="px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border hidden sm:flex whitespace-nowrap border-black/20 text-[#5c5b5b] shrink-0">
                      -{t.discountPercent}%
                    </div>
                  )}
                </motion.div>
              ))}
        </motion.div>
      </div>
    </section>
  );
}
