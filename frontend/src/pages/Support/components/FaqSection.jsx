import { ChevronDown } from "lucide-react";
import { useState } from "react";

const CATEGORIES = ["Tất cả", "Đơn hàng", "Giao hàng", "Đổi trả", "Thanh toán", "Tài khoản"];

const FAQ_ITEMS = [
  {
    category: "Đơn hàng",
    question: "Tôi có thể đổi size sau khi đã đặt hàng không?",
    answer:
      "Bạn có thể yêu cầu đổi size trong vòng 1 giờ kể từ khi đặt hàng — trước khi đơn được xác nhận xử lý. Sau thời gian này, vui lòng đợi nhận hàng rồi sử dụng quy trình đổi trả thông thường (miễn phí lần đầu).",
  },
  {
    category: "Đơn hàng",
    question: "Thời gian xử lý đơn hàng mất bao lâu?",
    answer:
      "Đơn hàng thường được xác nhận trong vòng 1–2 giờ (giờ hành chính). Sau khi xác nhận, chúng tôi mất thêm 2–4 giờ để đóng gói và bàn giao cho đơn vị vận chuyển.",
  },
  {
    category: "Giao hàng",
    question: "Bao lâu tôi nhận được hàng?",
    answer:
      "Thời gian giao hàng phụ thuộc vào khu vực: TP.HCM nội thành 2–4 giờ, TP.HCM ngoại thành 1–2 ngày, Hà Nội & Đà Nẵng 2–3 ngày, các tỉnh còn lại 3–5 ngày làm việc.",
  },
  {
    category: "Giao hàng",
    question: "Phí giao hàng được tính như thế nào?",
    answer:
      "Miễn phí giao hàng cho đơn từ 500.000đ trong nội thành TP.HCM. Các khu vực khác áp dụng phí từ 25.000đ–35.000đ tùy vùng. Xem chi tiết tại mục Giao hàng & Đổi trả bên dưới.",
  },
  {
    category: "Đổi trả",
    question: "Tôi có thể đổi/trả hàng trong bao lâu?",
    answer:
      "Chúng tôi chấp nhận đổi trả trong vòng 30 ngày kể từ ngày nhận hàng. Đổi size được miễn phí 1 lần — ship 2 chiều do Vibe Urban chịu. Hoàn tiền sẽ được xử lý trong 3–5 ngày làm việc sau khi nhận hàng trả về.",
  },
  {
    category: "Đổi trả",
    question: "Điều kiện để đổi/trả hàng là gì?",
    answer:
      "Sản phẩm cần còn nguyên tem nhãn, chưa qua sử dụng, không bị dính bẩn hoặc hư hỏng do lỗi của người dùng. Sản phẩm sale từ 50% trở lên và đồ lót không được đổi trả.",
  },
  {
    category: "Thanh toán",
    question: "Tôi có thể thanh toán bằng ví điện tử không?",
    answer:
      "Vibe Urban hiện hỗ trợ: thẻ ATM nội địa, thẻ Visa/Mastercard, chuyển khoản ngân hàng, MoMo, ZaloPay và thanh toán khi nhận hàng (COD). Tất cả giao dịch được mã hóa SSL.",
  },
  {
    category: "Tài khoản",
    question: "Làm sao để đổi mật khẩu tài khoản?",
    answer:
      "Đăng nhập → vào Tài khoản → chọn Đổi mật khẩu. Nhập mật khẩu hiện tại và mật khẩu mới (tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số). Nếu quên mật khẩu, dùng chức năng Quên mật khẩu tại trang đăng nhập.",
  },
];

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className={`border border-black/8 rounded-2xl overflow-hidden transition-all ${isOpen ? "bg-white shadow-sm" : "bg-white/60"}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-[#f9f6f5] transition"
      >
        <div className="flex items-center gap-3">
          <span className="shrink-0 inline-block bg-[#f3f0ef] text-[#5c5b5b] px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest">
            {item.category}
          </span>
          <span className="font-semibold text-[#0f172a] text-sm leading-snug">{item.question}</span>
        </div>
        <ChevronDown
          className={`shrink-0 w-4 h-4 text-[#5c5b5b] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-5">
          <div className="h-px bg-black/5 mb-4" />
          <p className="text-[#5c5b5b] text-sm leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const [activeIdx, setActiveIdx] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const filtered =
    activeCategory === "Tất cả"
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((f) => f.category === activeCategory);

  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 scroll-mt-28"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-block bg-[#ff6b35] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white mb-4 rounded-full">
            01 · FAQ
          </div>
          <h2 className="font-extrabold text-4xl sm:text-5xl tracking-tight text-[#0f172a] leading-tight">
            Câu hỏi{" "}
            <span className="text-[#004be3] italic font-serif lowercase">thường gặp</span>
          </h2>
        </div>
        <p className="text-[#5c5b5b] text-sm max-w-sm lg:text-right leading-relaxed">
          Không tìm được câu trả lời? Liên hệ trực tiếp với đội ngũ hỗ trợ của chúng tôi.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => { setActiveCategory(cat); setActiveIdx(null); }}
            className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition ${
              activeCategory === cat
                ? "bg-[#0f172a] text-white"
                : "bg-[#f3f0ef] text-[#5c5b5b] hover:bg-black/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filtered.map((item, i) => (
          <AccordionItem
            key={item.question}
            item={item}
            isOpen={activeIdx === i}
            onToggle={() => setActiveIdx(activeIdx === i ? null : i)}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 bg-[#0f172a] rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-white font-bold text-lg mb-1">Vẫn chưa tìm được câu trả lời?</p>
          <p className="text-white/50 text-sm">Đội ngũ CSKH sẵn sàng hỗ trợ bạn 7 ngày / tuần.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("contact");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="shrink-0 bg-[#004be3] text-white px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-[#0039b0] transition"
        >
          Liên hệ ngay →
        </button>
      </div>
    </section>
  );
}
