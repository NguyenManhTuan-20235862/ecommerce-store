import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const scheduleData = [
  { index: "01", name: "Kinetic Pack", items: 6, status: "LIVE NOW" },
  { index: "02", name: "Night Forms", items: 5, status: "LIVE" },
  { index: "03", name: "Pulse x District", items: 6, status: "PREPARE" },
  { index: "04", name: "Core Everyday", items: 12, status: "RESTOCK - 10.01" },
  { index: "05", name: "Field Edition", items: 6, status: "RESTOCK - 20.01" },
  { index: "06", name: "Lunar Capsule", items: 4, status: "RESTOCK - 10.02" },
];

export default function NewDrops() {
  const [timeLeft, setTimeLeft] = useState({
    days: 25,
    hours: 18,
    minutes: 44,
    seconds: 9,
  });

  // Countdown logic (mock)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }
        if (days < 0) {
          clearInterval(timer);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#f9f6f5] min-h-screen text-[#0f172a] font-sans">
      {/* 1. Marquee Section */}
      <section className="w-full overflow-hidden bg-[#004be3] py-2 border-b border-black/10">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-custom {
            animation: marquee 15s linear infinite;
          }
        `}</style>
        <div className="flex whitespace-nowrap animate-marquee-custom w-[200%]">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-8 px-4 text-[10px] font-bold uppercase tracking-widest text-white w-1/4 justify-around"
            >
              <span>
                ● MARQUEE — "DROP 24/12 LIVE - COUNTDOWN 28/12 - RESTOCK 02/01"
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        {/* 2. Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start mb-16">
          <div className="flex flex-col">
            <div className="inline-block border border-black/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#0f172a] mb-6 w-fit bg-white rounded-full">
              SCHEDULE — Q1.25
            </div>
            <h1 className="font-heading text-6xl font-extrabold uppercase leading-[0.85] tracking-tight text-[#0f172a] sm:text-8xl md:text-[120px]">
              NEW
              <br />
              DROPS
              <br />
              EVERY MONTH
            </h1>
          </div>

          <div className="flex flex-col lg:pl-12 pt-8 lg:pt-0 lg:ml-auto w-full max-w-lg">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-4">
              // NEXT DROP IN
            </p>

            {/* Timer Blocks */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4">
              <div className="flex flex-col items-center justify-center border border-black/10 bg-white py-6 rounded-2xl">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#0f172a]">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mt-1">
                  NGÀY
                </span>
              </div>
              <div className="flex flex-col items-center justify-center border border-black/10 bg-white py-6 rounded-2xl">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#0f172a]">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mt-1">
                  GIỜ
                </span>
              </div>
              <div className="flex flex-col items-center justify-center border border-black/10 bg-white py-6 rounded-2xl">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#0f172a]">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mt-1">
                  PHÚT
                </span>
              </div>
              <div className="flex flex-col items-center justify-center border border-black/10 bg-white py-6 rounded-2xl">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#0f172a]">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mt-1">
                  GIÂY
                </span>
              </div>
            </div>

            {/* Notification Bar */}
            <div className="flex items-center justify-between bg-[#0f172a] p-4 text-white rounded-2xl">
              <div className="flex flex-col">
                <span className="text-[10px] tracking-widest text-[#94a3b8] uppercase">
                  28.12.24 — 20:00 ICT
                </span>
                <span className="text-sm font-bold tracking-widest uppercase mt-1">
                  PULSE x DISTRICT — 6 ITEMS
                </span>
              </div>
              <button className="bg-white text-[#0f172a] px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition rounded-full">
                ĐẶT NHẮC
              </button>
            </div>
          </div>
        </section>

        {/* 3. Lịch Ra Hàng (Schedule List) */}
        <section className="mb-16">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-6">
            // LỊCH RA HÀNG
          </p>
          <div className="flex flex-col border-t border-black/10">
            {scheduleData.map((item, idx) => (
              <div
                key={idx}
                className="group flex flex-col sm:flex-row sm:items-center py-6 border-b border-black/10 transition hover:bg-white/50 cursor-pointer"
              >
                <div className="flex items-center gap-6 sm:gap-12 w-full sm:w-1/2">
                  <span className="text-3xl font-extrabold text-[#0f172a] w-12">
                    {item.index}
                  </span>
                  <span className="text-xl font-bold text-[#0f172a] group-hover:text-[#004be3] transition">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-1/2 gap-8 mt-4 sm:mt-0">
                  <span className="text-[11px] font-medium tracking-widest text-[#94a3b8] uppercase">
                    {item.items} items
                  </span>
                  <div className="flex items-center gap-4">
                    <span
                      className={`border px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full ${
                        item.status.includes("LIVE")
                          ? "border-[#0f172a] text-[#0f172a]"
                          : "border-black/20 text-[#94a3b8]"
                      }`}
                    >
                      {item.status.includes("LIVE") ? "● " : ""}
                      {item.status}
                    </span>
                    <ChevronRight className="h-5 w-5 text-[#94a3b8] group-hover:text-[#004be3] transition" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Highlight Section (Bottom Grid) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-20">
          {/* Left Panel (Live Now) */}
          <div className="bg-[#1e293b] p-8 sm:p-10 text-white flex flex-col rounded-3xl">
            <span className="inline-block border border-white/20 px-2 py-1 text-[10px] font-bold tracking-widest w-fit mb-4 rounded-full">
              ● LIVE NOW
            </span>
            <h2 className="font-heading text-5xl font-extrabold uppercase leading-[0.9] tracking-tight sm:text-6xl mb-2">
              KINETIC
              <br />
              PACK
            </h2>
            <p className="text-[10px] tracking-widest text-[#94a3b8] uppercase mb-8">
              06 ITEMS - DROP 24.12.24
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
              {[
                { id: "01", name: "Velocity 92" },
                { id: "02", name: "Outlaw Low" },
                { id: "03", name: "Sling Utility 03" },
                { id: "04", name: "Pulse x Panel" },
              ].map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 bg-white/5 p-3 hover:bg-white/10 transition cursor-pointer border border-white/10 rounded-2xl"
                >
                  <div className="h-10 w-10 bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/50 rounded-xl">
                    P{p.id}
                  </div>
                  <span className="text-xs font-bold">{p.name}</span>
                </div>
              ))}
            </div>

            <Link
              to="/shop"
              className="mt-8 bg-white text-[#0f172a] px-6 py-3 text-[10px] font-bold uppercase tracking-widest w-fit hover:bg-gray-200 transition rounded-full"
            >
              MUA NGUYÊN BỘ <span className="ml-2">→</span>
            </Link>
          </div>

          {/* Right Panel (Prepare) */}
          <div className="bg-white border border-black/10 p-8 sm:p-10 flex flex-col rounded-3xl">
            <span className="inline-block border border-black/10 px-2 py-1 text-[10px] font-bold tracking-widest text-[#94a3b8] w-fit mb-4 rounded-full">
              ● PREPARE
            </span>
            <h2 className="font-heading text-5xl font-extrabold uppercase leading-[0.9] tracking-tight text-[#0f172a] sm:text-6xl mb-4 italic">
              PULSE <span className="text-[#004be3]">x</span> DISTRICT
            </h2>
            <p className="text-xs text-[#334155] max-w-sm mb-8">
              Công tác collab mới District Co. Sài Gòn — 6 phụ kiện limited, làm
              thủ công, đánh số 001-120.
            </p>

            <div className="flex flex-wrap gap-2 mt-auto mb-8">
              {["#001", "#002", "#003", "#004", "#005", "#006"].map((tag) => (
                <div
                  key={tag}
                  className="border border-black/10 px-4 py-3 text-[11px] font-bold text-[#94a3b8] hover:border-[#004be3] hover:text-[#004be3] transition cursor-pointer rounded-2xl"
                >
                  {tag}
                </div>
              ))}
            </div>

            <button className="bg-[#004be3] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest w-fit hover:bg-blue-700 transition rounded-full">
              ĐĂNG KÝ EARLY ACCESS <span className="ml-2">→</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
