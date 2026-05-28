import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { fadeUpItem, scrollFadeUp, staggerContainer } from "../../../animations/variants";

export default function TrendingSection({ trendCards }) {
  return (
    <section
      id="trending"
      className="bg-[#f9f6f5] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-24"
    >
      <div className="mx-auto flex w-full max-w-400 flex-col gap-12">
        <motion.div {...scrollFadeUp} className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#004be3]">
            Trending now
          </p>
          <h2 className="mt-3 text-[1.9rem] font-extrabold uppercase tracking-[-0.05em] sm:text-[3.1rem] lg:text-6xl">
            Những khối hình đang lên phố
          </h2>
          <p className="mt-4 text-base leading-8 text-[#71717a] sm:text-lg">
            Ưu tiên hàng đầu của chúng tôi là sự hài lòng tuyệt đối của khách
            hàng.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <motion.article {...scrollFadeUp} className="relative min-h-110 overflow-hidden rounded-4xl bg-[#111827] shadow-[0_30px_90px_rgba(47,47,46,0.16)] sm:min-h-130 lg:min-h-140">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&q=80&fit=crop"
              alt="The Saigon Techwear Scene"
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.75))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,254,102,0.18),transparent_22%),radial-gradient(circle_at_80%_10%,rgba(0,75,227,0.3),transparent_30%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_42%,rgba(255,255,255,0.04))]" />
            <div className="absolute inset-0 flex items-end p-8 sm:p-10">
              <div className="max-w-xl text-white">
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#00fe66]">
                  Featured story
                </p>
                <h3 className="mt-3 text-[2.1rem] font-extrabold uppercase leading-[0.95] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                  The Saigon techwear scene
                </h3>
                <p className="mt-4 max-w-lg text-base leading-7 text-white/75">
                  Hình ảnh đậm chất đường phố, dùng mảng màu tối và ánh sáng
                  nhấn để kéo mắt vào sản phẩm và câu chuyện thương hiệu.
                </p>
                <Link
                  to="/shop"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-white px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#2f2f2e]"
                >
                  Đọc thêm
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.article>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-5"
          >
            {trendCards.map((card) => (
              <motion.article
                key={card.title}
                variants={fadeUpItem}
                className={`relative min-h-61.75 overflow-hidden rounded-4xl bg-linear-to-br ${card.tone} p-7 text-white shadow-[0_20px_50px_rgba(47,47,46,0.12)]`}
              >
                {card.image && (
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-35 transition duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.18),transparent_28%)]" />
                <div className="relative flex h-full flex-col justify-end">
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/70">
                    Lookbook
                  </p>
                  <h3 className="mt-3 text-3xl font-extrabold uppercase tracking-[-0.05em]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm uppercase tracking-[0.22em] text-white/75">
                    {card.subtitle}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
