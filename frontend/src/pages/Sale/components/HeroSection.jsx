import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { scrollSlideLeft, scrollSlideRight } from "../../../animations/variants";

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 11,
    minutes: 42,
    seconds: 8,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { clearInterval(timer); return { days: 0, hours: 0, minutes: 0, seconds: 0 }; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pt-12 pb-8 sm:px-6 lg:px-8">
      <div className="bg-[#f9f6f5] rounded-[2rem] border border-black/10 overflow-hidden flex flex-col md:flex-row shadow-sm">
        {/* Left Text */}
        <motion.div
          {...scrollSlideLeft}
          className="p-8 md:p-12 lg:p-16 flex-1 flex flex-col justify-center bg-[#f9f6f5] relative"
        >
          <div className="inline-block border border-black/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#2f2f2e] mb-8 w-fit rounded-full">
            ƯU ĐÃI • CUỐI NĂM 2026
          </div>
          <h1 className="font-heading text-6xl font-extrabold leading-[0.9] tracking-tight text-[#2f2f2e] sm:text-7xl md:text-6xl lg:text-[100px] mb-8 uppercase">
            Ưu đãi<br />
            nắng vàng,<br />
            giảm <span className="text-[#004be3] italic font-serif lowercase text-5xl sm:text-6xl md:text-5xl lg:text-[90px]">tận tay.</span>
          </h1>
          <p className="text-sm font-medium text-[#5c5b5b] mb-8 max-w-md">
            Đến 30% trên toàn bộ phụ kiện & giày — kéo dài 48 tiếng. Cộng dồn với tier ưu đãi của bạn. Miễn phí ship đơn từ 1 triệu.
          </p>
          <div className="flex items-center gap-4">
            <button className="bg-[#2f2f2e] text-white px-6 py-3 text-[11px] font-bold uppercase tracking-widest rounded-full hover:brightness-110 transition">
              Mua đồ giảm giá
            </button>
            <button
              onClick={() => document.getElementById("coupons-section")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="border border-black/20 bg-[#f9f6f5] text-[#2f2f2e] px-6 py-3 text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-[#f3f0ef] transition"
            >
              Lấy mã giảm
            </button>
          </div>
        </motion.div>

        {/* Right Widget */}
        <motion.div
          {...scrollSlideRight}
          className="p-8 md:p-12 lg:p-16 flex-1 bg-[#f3f0ef] flex items-center justify-center border-l border-black/5"
        >
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/10 w-full max-w-md">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5b5b] mb-4">
              Ưu đãi kết thúc sau
            </p>

            {/* Timers */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              {[
                { value: timeLeft.days, label: "ngày" },
                { value: timeLeft.hours, label: "giờ" },
                { value: timeLeft.minutes, label: "phút" },
                { value: timeLeft.seconds, label: "giây" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center bg-[#f3f0ef] py-4 rounded-2xl">
                  <span className="text-3xl font-extrabold text-[#2f2f2e]">
                    {String(value).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] font-bold uppercase text-[#5c5b5b] mt-1">{label}</span>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#5c5b5b] mb-2">
                <span>Tiến độ</span>
                <span>312 / 480 đã bán</span>
              </div>
              <div className="h-2 w-full bg-[#f3f0ef] rounded-full overflow-hidden">
                <div className="h-full bg-[#004be3] w-[65%] rounded-full" />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-black/10 rounded-2xl p-4">
                <p className="text-[9px] font-bold uppercase text-[#5c5b5b] mb-1">Đã tiết kiệm</p>
                <p className="text-lg font-extrabold text-[#2f2f2e]">184.2M đ</p>
              </div>
              <div className="border border-black/10 rounded-2xl p-4">
                <p className="text-[9px] font-bold uppercase text-[#5c5b5b] mb-1">Sắp hết</p>
                <p className="text-sm font-extrabold text-[#2f2f2e] truncate">Outlaw Low • 4</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
