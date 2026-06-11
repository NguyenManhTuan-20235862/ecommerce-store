import { motion } from "framer-motion";
import { Gift, RotateCcw, Star, Truck } from "lucide-react";
import { fadeUpItem, scrollFadeUp, staggerContainer } from "../../../animations/variants";

const PERKS = [
  { icon: Truck, title: "Miễn phí ship", sub: "Đơn từ 1.000.000đ" },
  { icon: RotateCcw, title: "Đổi size 7 ngày", sub: "Chưa dùng còn nguyên seal" },
  { icon: Star, title: "2x điểm member", sub: "Cộng dồn với mọi mã" },
  { icon: Gift, title: "Quà sinh nhật", sub: "Voucher 22% trong tháng" },
];

export default function PerksSection() {
  return (
    <motion.section
      {...scrollFadeUp}
      className="mx-auto w-full max-w-[1440px] px-4 pb-12 sm:px-6 lg:px-8"
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {PERKS.map(({ icon: Icon, title, sub }) => (
          <motion.div
            key={title}
            variants={fadeUpItem}
            className="bg-[#f9f6f5] border border-black/5 p-4 rounded-2xl flex items-center gap-4"
          >
            <div className="h-10 w-10 rounded-full bg-[#f3f0ef] flex items-center justify-center text-[#004be3] shrink-0">
              <Icon size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-[#2f2f2e]">{title}</p>
              <p className="text-[10px] text-[#5c5b5b]">{sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
