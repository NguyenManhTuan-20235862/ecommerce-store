import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router";

export default function HeroSection({
  isAuthenticated,
  isHomeMode,
  heroStats,
  heroFeatureItems,
}) {
  return (
    <section className="relative px-4 pb-11 pt-4 sm:px-6 sm:pb-14 lg:px-10 lg:pb-20 lg:pt-6">
      <div className="relative mx-auto mt-2 grid w-full max-w-400 gap-4.5 sm:mt-4 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <div className="relative overflow-hidden rounded-4xl border border-black/5 bg-white/70 p-5 shadow-[0_32px_90px_rgba(47,47,46,0.08)] backdrop-blur-sm sm:p-7 lg:p-10 xl:p-11">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#004be3]">
            Available now
          </p>

          <div className="mt-4 max-w-4xl font-heading text-[clamp(2.45rem,8vw,7.4rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.06em] sm:mt-5">
            <span className="block text-[#2f2f2e]">Fuel your</span>
            <span className="block italic text-[#004be3]">urban</span>
            <span className="block text-[#2f2f2e]">movement</span>
          </div>

          <p className="mt-5 max-w-xl text-[14px] leading-6.5 text-[#5c5b5b] sm:mt-6 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
            Streetwear nam cho nhịp sống nhanh: áo khoác, hoodie, quần cargo và
            phụ kiện được chọn theo tinh thần gọn gàng, mạnh mẽ, dễ mặc mỗi
            ngày.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#004be3_0%,#819bff_100%)] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_12px_24px_rgba(0,75,227,0.16)] transition hover:-translate-y-px hover:brightness-105"
            >
              Mua ngay
              <ArrowRight className="h-4 w-4" />
            </Link>
            {!isAuthenticated && !isHomeMode ? (
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#dfdcdc] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-[#2f2f2e] transition hover:bg-[#d5d1d0]"
              >
                Tạo tài khoản
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                to="/shop?collection=new"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#dfdcdc] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-[#2f2f2e] transition hover:bg-[#d5d1d0]"
              >
                Xem bộ mới
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <div className="mt-7 grid gap-3 sm:mt-10 sm:grid-cols-3">
            {heroStats.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm"
              >
                <p className="font-heading text-[1.75rem] font-extrabold tracking-[-0.05em] text-[#2f2f2e] sm:text-3xl">
                  {item.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5c5b5b]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute -left-20 top-20 select-none font-heading text-[9rem] font-extrabold italic uppercase tracking-[-0.08em] text-[#2f2f2e] opacity-[0.03] sm:-left-24 sm:text-[18rem]">
            vibe urban vibe urban
          </div>
        </div>

        <div className="relative min-h-140 overflow-hidden rounded-4xl border border-black/5 bg-[#2f2f2e] shadow-[0_32px_90px_rgba(47,47,46,0.16)] sm:min-h-160 lg:min-h-180">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(0,75,227,0.35),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.16))]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.2))]" />
          <div className="absolute left-6 top-6 rounded-full bg-[#00fe66] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#004616] shadow-[0_12px_24px_rgba(0,0,0,0.1)]">
            Drop 04
          </div>
          <div className="absolute right-6 top-6 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80 backdrop-blur">
            Out now
          </div>
          <div className="absolute inset-x-0 top-0 h-[64%] bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0))]" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
            <div className="overflow-hidden rounded-[1.75rem] border border-white/15 bg-black/20 p-5 backdrop-blur-md sm:p-6">
              <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(17,24,39,0.96)_0%,rgba(31,41,55,0.94)_55%,rgba(87,39,174,0.92)_100%)] p-4 sm:p-5 shadow-[0_25px_50px_rgba(0,0,0,0.24)]">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/70">
                    Featured story
                  </p>
                  <h2 className="mt-3 max-w-md text-[1.45rem] font-extrabold uppercase leading-none tracking-[-0.05em] text-white sm:text-[1.85rem] lg:text-4xl">
                    The Saigon techwear scene
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-7 text-white/75">
                    Câu chuyện thị giác mang hơi thở đô thị, tập trung vào khối
                    lớn, ánh sáng mạnh và cảm giác cao cấp ngay từ cái nhìn đầu
                    tiên.
                  </p>
                  <Link
                    to="/shop"
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/80 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#2f2f2e]"
                  >
                    Xem bộ sưu tập
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid gap-3">
                  {heroFeatureItems.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.25rem] border border-white/10 bg-white/10 px-4 py-4 text-white backdrop-blur-sm"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/60">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
