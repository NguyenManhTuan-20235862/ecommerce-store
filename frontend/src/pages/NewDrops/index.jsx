import { productService } from "@/services/product.service";
import { formatCurrency } from "@/utils/formatCurrency";
import { getImageUrl } from "@/utils/getImageUrl";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

// ── Ngày target cho countdown: ngày 1 tháng sau lúc 20:00 ──────────────────
const buildNextDropDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1, 20, 0, 0);
};
const NEXT_DROP_DATE = buildNextDropDate();

const getTimeLeft = (target) => {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
};

const nextDropLabel = NEXT_DROP_DATE.toLocaleDateString("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

// ── Schedule — giờ đã gắn link thật ──────────────────────────────────────────
const scheduleData = [
  { index: "01", name: "Urban Core SS26",    items: 8,  status: "LIVE NOW",         to: "/shop?featured=true" },
  { index: "02", name: "Night Forms Vol.2",  items: 5,  status: "LIVE",             to: "/shop?featured=true" },
  { index: "03", name: "Pulse x District",  items: 6,  status: "PREPARE",          to: null },
  { index: "04", name: "Core Everyday",     items: 12, status: "RESTOCK - 01.07",  to: "/shop" },
  { index: "05", name: "Field Edition",     items: 6,  status: "RESTOCK - 15.07",  to: "/shop" },
  { index: "06", name: "Lunar Capsule",     items: 4,  status: "RESTOCK - 01.08",  to: "/shop" },
];

// ── Component sản phẩm trong panel tối ──────────────────────────────────────
function LiveProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:border-white/20 hover:bg-white/10"
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/10">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-white/30">
            IMG
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-white">{product.name}</p>
        <p className="mt-0.5 text-[10px] text-[#94a3b8]">{formatCurrency(product.price)}</p>
      </div>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/30" />
    </Link>
  );
}

function LiveProductCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="h-2.5 w-1/2 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function NewDrops() {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(NEXT_DROP_DATE));
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Countdown thật — tính từ NEXT_DROP_DATE
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(NEXT_DROP_DATE)), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch sản phẩm isFeatured=true
  useEffect(() => {
    productService
      .list({ featured: true, limit: 6 })
      .then((res) => {
        const products = res.data?.products || [];
        setFeaturedProducts(
          products.map((p) => ({
            _id:   p._id,
            slug:  p.slug,
            name:  p.name,
            price: p.price,
            image: getImageUrl(p.images?.[0] || ""),
          })),
        );
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSetReminder = () => {
    const saved = JSON.parse(localStorage.getItem("vibe-drop-reminders") || "[]");
    const key = "pulse-x-district-2026";
    if (!saved.includes(key)) {
      localStorage.setItem("vibe-drop-reminders", JSON.stringify([...saved, key]));
      toast.success("Đã lưu nhắc nhở! Chúng tôi sẽ thông báo khi drop ra hàng.");
    } else {
      toast.info("Bạn đã đặt nhắc nhở cho drop này rồi.");
    }
  };

  const handleEarlyAccess = () => {
    const saved = JSON.parse(localStorage.getItem("vibe-early-access") || "[]");
    const key = "pulse-x-district-2026";
    if (!saved.includes(key)) {
      localStorage.setItem("vibe-early-access", JSON.stringify([...saved, key]));
      toast.success("Đã đăng ký Early Access! Bạn sẽ nhận thông báo trước 24h.");
    } else {
      toast.info("Bạn đã đăng ký Early Access cho drop này rồi.");
    }
  };

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#f9f6f5] font-sans text-[#0f172a]">
      {/* Marquee */}
      <section className="w-full overflow-hidden border-b border-black/10 bg-[#004be3] py-2">
        <style>{`
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .animate-marquee-drop { animation: marquee 18s linear infinite; }
        `}</style>
        <div className="flex w-[200%] whitespace-nowrap animate-marquee-drop">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="mx-10 text-[10px] font-bold uppercase tracking-widest text-white">
              ● URBAN CORE SS26 — LIVE NOW &nbsp;·&nbsp; PULSE × DISTRICT — DROPPING {nextDropLabel} &nbsp;·&nbsp; EARLY ACCESS OPEN
            </span>
          ))}
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">

        {/* Hero */}
        <section className="mb-16 grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col">
            <div className="mb-6 w-fit rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#0f172a]">
              SCHEDULE — Q2–Q3.26
            </div>
            <h1 className="font-heading text-6xl font-extrabold uppercase leading-[0.85] tracking-tight text-[#0f172a] sm:text-8xl md:text-[120px]">
              NEW
              <br />
              DROPS
              <br />
              EVERY MONTH
            </h1>
          </div>

          <div className="flex w-full max-w-lg flex-col pt-8 lg:ml-auto lg:pl-12 lg:pt-0">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
              // NEXT DROP IN
            </p>

            {/* Timer thật */}
            <div className="mb-4 grid grid-cols-4 gap-2 sm:gap-4">
              {[
                { value: timeLeft.days,    label: "NGÀY" },
                { value: timeLeft.hours,   label: "GIỜ" },
                { value: timeLeft.minutes, label: "PHÚT" },
                { value: timeLeft.seconds, label: "GIÂY" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center justify-center rounded-2xl border border-black/10 bg-white py-6">
                  <span className="text-4xl font-extrabold text-[#0f172a] sm:text-5xl">{pad(value)}</span>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">{label}</span>
                </div>
              ))}
            </div>

            {/* Drop info + nút nhắc */}
            <div className="flex items-center justify-between rounded-2xl bg-[#0f172a] p-4 text-white">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-[#94a3b8]">
                  {nextDropLabel} — 20:00 ICT
                </span>
                <span className="mt-1 text-sm font-bold uppercase tracking-widest">
                  PULSE × DISTRICT — 6 ITEMS
                </span>
              </div>
              <button
                onClick={handleSetReminder}
                className="rounded-full bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#0f172a] transition hover:bg-gray-200"
              >
                ĐẶT NHẮC
              </button>
            </div>
          </div>
        </section>

        {/* Lịch ra hàng */}
        <section className="mb-16">
          <p className="mb-6 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
            // LỊCH RA HÀNG
          </p>
          <div className="flex flex-col border-t border-black/10">
            {scheduleData.map((item) => {
              const isLive = item.status.includes("LIVE");
              const inner = (
                <div className={`group flex flex-col border-b border-black/10 py-6 transition sm:flex-row sm:items-center ${item.to ? "cursor-pointer hover:bg-white/50" : "cursor-default"}`}>
                  <div className="flex w-full items-center gap-6 sm:w-1/2 sm:gap-12">
                    <span className="w-12 text-3xl font-extrabold text-[#0f172a]">{item.index}</span>
                    <span className={`text-xl font-bold text-[#0f172a] ${item.to ? "group-hover:text-[#004be3]" : ""} transition`}>
                      {item.name}
                    </span>
                  </div>
                  <div className="mt-4 flex w-full items-center justify-between gap-8 sm:mt-0 sm:w-1/2 sm:justify-end">
                    <span className="text-[11px] font-medium uppercase tracking-widest text-[#94a3b8]">
                      {item.items} items
                    </span>
                    <div className="flex items-center gap-4">
                      <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${isLive ? "border-[#0f172a] text-[#0f172a]" : "border-black/20 text-[#94a3b8]"}`}>
                        {isLive ? "● " : ""}{item.status}
                      </span>
                      {item.to && <ChevronRight className={`h-5 w-5 text-[#94a3b8] transition ${item.to ? "group-hover:text-[#004be3]" : ""}`} />}
                    </div>
                  </div>
                </div>
              );

              return item.to
                ? <Link key={item.index} to={item.to}>{inner}</Link>
                : <div key={item.index}>{inner}</div>;
            })}
          </div>
        </section>

        {/* Bottom panels */}
        <section className="mb-20 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">

          {/* Live Now — sản phẩm thật */}
          <div className="flex flex-col rounded-3xl bg-[#1e293b] p-8 text-white sm:p-10">
            <span className="mb-4 w-fit rounded-full border border-white/20 px-2 py-1 text-[10px] font-bold tracking-widest">
              ● LIVE NOW
            </span>
            <h2 className="mb-2 font-heading text-5xl font-extrabold uppercase leading-[0.9] tracking-tight sm:text-6xl">
              URBAN
              <br />
              CORE SS26
            </h2>
            <p className="mb-6 text-[10px] uppercase tracking-widest text-[#94a3b8]">
              {isLoading ? "LOADING..." : `${featuredProducts.length} ITEMS — DROP LIVE`}
            </p>

            <div className="mt-auto grid grid-cols-1 gap-3 sm:grid-cols-2">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <LiveProductCardSkeleton key={i} />)
                : featuredProducts.length > 0
                  ? featuredProducts.slice(0, 4).map((p) => <LiveProductCard key={p._id} product={p} />)
                  : (
                    <p className="col-span-2 py-4 text-center text-sm text-white/40">
                      Chưa có sản phẩm trong drop này
                    </p>
                  )
              }
            </div>

            <Link
              to="/shop?featured=true"
              className="mt-6 w-fit rounded-full bg-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#0f172a] transition hover:bg-gray-200"
            >
              XEM TẤT CẢ DROP <span className="ml-2">→</span>
            </Link>
          </div>

          {/* Prepare — Early Access */}
          <div className="flex flex-col rounded-3xl border border-black/10 bg-white p-8 sm:p-10">
            <span className="mb-4 w-fit rounded-full border border-black/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
              ● PREPARE
            </span>
            <h2 className="mb-4 font-heading text-5xl font-extrabold uppercase italic leading-[0.9] tracking-tight text-[#0f172a] sm:text-6xl">
              PULSE <span className="text-[#004be3]">x</span> DISTRICT
            </h2>
            <p className="mb-2 max-w-sm text-xs text-[#334155]">
              Collab mới cùng District Co. Sài Gòn — 6 phụ kiện limited, làm thủ công, đánh số 001–120.
            </p>
            <p className="mb-8 text-[10px] font-semibold uppercase tracking-widest text-[#004be3]">
              Ra mắt {nextDropLabel} — 20:00 ICT
            </p>

            <div className="mb-8 mt-auto flex flex-wrap gap-2">
              {["#001", "#002", "#003", "#004", "#005", "#006"].map((tag) => (
                <div key={tag} className="cursor-default rounded-2xl border border-black/10 px-4 py-3 text-[11px] font-bold text-[#94a3b8]">
                  {tag}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleEarlyAccess}
                className="rounded-full bg-[#004be3] px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-blue-700"
              >
                ĐĂNG KÝ EARLY ACCESS <span className="ml-2">→</span>
              </button>
              <button
                onClick={handleSetReminder}
                className="rounded-full border border-black/10 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5c5b5b] transition hover:bg-[#f3f0ef]"
              >
                ĐẶT NHẮC
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
