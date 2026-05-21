import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import ContactSection from "./components/ContactSection";
import FaqSection from "./components/FaqSection";
import ShippingSection from "./components/ShippingSection";

const NAV_ITEMS = [
  { id: "faq", label: "FAQ" },
  { id: "shipping", label: "Giao hàng & Đổi trả" },
  { id: "contact", label: "Liên hệ" },
];

export default function SupportPage() {
  const { hash } = useLocation();
  const [activeSection, setActiveSection] = useState("faq");
  const sectionRefs = useRef({});

  // Scroll đến anchor khi hash thay đổi
  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
  }, [hash]);

  // Highlight nav pill theo section hiện tại khi scroll
  useEffect(() => {
    const observers = [];
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-[#f9f6f5] min-h-screen">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="bg-[#0f172a] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#004be3]/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-[#ff6b35]/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-block bg-[#ff6b35] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white mb-6 rounded-full">
              Hỗ trợ khách hàng
            </div>
            <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-white mb-6">
              Chúng tôi luôn{" "}
              <span className="text-[#819BFF] italic font-serif lowercase">
                ở đây
              </span>{" "}
              để hỗ trợ bạn.
            </h1>
            <p className="text-white/60 text-base leading-relaxed mb-10 max-w-xl">
              Tìm câu trả lời nhanh trong FAQ, xem chính sách giao hàng và đổi trả,
              hoặc liên hệ trực tiếp với đội ngũ CSKH của Vibe Urban.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              {[
                { value: "< 2h", label: "Phản hồi trung bình" },
                { value: "30 ngày", label: "Chính sách đổi trả" },
                { value: "7/7", label: "Hỗ trợ mọi ngày" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="h-8 w-[2px] bg-[#004be3] rounded-full" />
                  <div>
                    <p className="text-white font-extrabold text-lg leading-none">{stat.value}</p>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky Nav ───────────────────────────────── */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur border-b border-black/5 shadow-sm">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition ${
                  activeSection === id
                    ? "bg-[#004be3] text-white shadow-sm"
                    : "bg-[#f3f0ef] text-[#5c5b5b] hover:bg-black/5"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sections ─────────────────────────────────── */}
      <FaqSection />
      <ShippingSection />
      <ContactSection />
    </div>
  );
}
