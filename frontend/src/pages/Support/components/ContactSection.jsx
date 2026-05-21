import { useState } from "react";
import { toast } from "sonner";

const CONTACT_CARDS = [
  {
    icon: "📞",
    title: "Hotline",
    value: "1800 9090",
    badge: "Miễn phí",
    desc: "Thứ 2–Thứ 7 · 8:00–21:00",
    bg: "#e8f0fe",
    accent: "#004be3",
  },
  {
    icon: "✉️",
    title: "Email",
    value: "hello@vibeurban.vn",
    badge: "< 24h",
    desc: "Phản hồi trong vòng 24 giờ",
    bg: "#fff7ed",
    accent: "#ff6b35",
  },
  {
    icon: "💬",
    title: "Zalo",
    value: "0901 234 567",
    badge: "Chat nhanh",
    desc: "Phản hồi trong vài phút",
    bg: "#f0fdf4",
    accent: "#16a34a",
  },
  {
    icon: "🌐",
    title: "Live Chat",
    value: "Trên website",
    badge: "Online",
    desc: "Thứ 2–Thứ 6 · 9:00–18:00",
    bg: "#fdf4ff",
    accent: "#9333ea",
  },
];

const SUBJECTS = ["Đơn hàng", "Sản phẩm", "Giao hàng", "Đổi trả", "Tài khoản", "Khác"];

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast.success("Tin nhắn đã được gửi! Chúng tôi sẽ phản hồi trong 24h.");
    }, 1200);
  };

  return (
    <section
      id="contact"
      className="border-t border-black/10 bg-[#f9f6f5] scroll-mt-28"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14">
          <div className="inline-block bg-[#ff6b35] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white mb-4 rounded-full">
            03 · Liên hệ
          </div>
          <h2 className="font-extrabold text-4xl sm:text-5xl tracking-tight text-[#0f172a] leading-tight">
            Nói chuyện với{" "}
            <span className="text-[#004be3] italic font-serif lowercase">chúng tôi</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* ── Trái: Contact Cards ─────────────────── */}
          <div>
            <p className="text-[#5c5b5b] text-sm leading-relaxed mb-8 max-w-md">
              Chọn kênh liên hệ phù hợp nhất với bạn. Đội ngũ CSKH của Vibe Urban
              luôn sẵn sàng hỗ trợ bạn nhanh nhất có thể.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CONTACT_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="group rounded-2xl p-6 border border-black/5 hover:border-black/10 hover:shadow-md transition-all cursor-default"
                  style={{ backgroundColor: card.bg }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{card.icon}</span>
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: card.accent }}
                    >
                      {card.badge}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: card.accent }}>
                    {card.title}
                  </p>
                  <p className="font-extrabold text-[#0f172a] text-base mb-1 leading-tight">{card.value}</p>
                  <p className="text-[#5c5b5b] text-[12px]">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Business hours note */}
            <div className="mt-6 flex items-start gap-3 p-4 bg-white rounded-2xl border border-black/5">
              <span className="text-xl mt-0.5">🕐</span>
              <div>
                <p className="font-bold text-[#0f172a] text-sm mb-1">Giờ làm việc chung</p>
                <p className="text-[#5c5b5b] text-[12px] leading-relaxed">
                  Thứ 2–Thứ 6: 8:00–21:00 · Thứ 7: 8:00–18:00 · Chủ nhật: 9:00–17:00
                </p>
              </div>
            </div>
          </div>

          {/* ── Phải: Contact Form ───────────────────── */}
          <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
            <p className="font-bold text-[#0f172a] text-lg mb-1">Gửi tin nhắn</p>
            <p className="text-[#5c5b5b] text-sm mb-8">Điền form bên dưới — chúng tôi sẽ phản hồi sớm nhất có thể.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#5c5b5b] mb-1.5">
                    Họ tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-[#0f172a] text-sm placeholder:text-[#aaa] focus:outline-none focus:border-[#004be3] focus:ring-1 focus:ring-[#004be3] transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#5c5b5b] mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="ban@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-[#0f172a] text-sm placeholder:text-[#aaa] focus:outline-none focus:border-[#004be3] focus:ring-1 focus:ring-[#004be3] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-[#5c5b5b] mb-1.5">
                  Chủ đề
                </label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-[#0f172a] text-sm bg-white focus:outline-none focus:border-[#004be3] focus:ring-1 focus:ring-[#004be3] transition"
                >
                  <option value="">Chọn chủ đề...</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-[#5c5b5b] mb-1.5">
                  Tin nhắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Mô tả chi tiết vấn đề bạn cần hỗ trợ..."
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-[#0f172a] text-sm placeholder:text-[#aaa] resize-none focus:outline-none focus:border-[#004be3] focus:ring-1 focus:ring-[#004be3] transition"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-[#004be3] text-white py-3.5 rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-[#0039b0] disabled:opacity-60 transition flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Đang gửi...
                  </>
                ) : (
                  "Gửi tin nhắn →"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
