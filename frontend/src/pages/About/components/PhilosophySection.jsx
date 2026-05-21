import { X } from "lucide-react";
import { useState } from "react";

const CARDS = [
  {
    num: "01",
    bg: "#ff6b35",
    textDark: false,
    title: "Chất liệu sống",
    summary: "Da bò veg-tan, sợi cordura, kim loại YKK. Già đi đẹp, không cũ đi xấu.",
    detail: `Chúng tôi chọn vật liệu như người ta chọn bạn đồng hành — không phải vì rẻ, mà vì sẽ ở lại lâu dài.

Da bò thuộc veg-tan là loại da thuộc hoàn toàn từ tanin tự nhiên, không dùng hóa chất công nghiệp. Theo thời gian, da sẽ sẫm màu và hình thành patina độc bản trên từng sản phẩm — không có hai chiếc ví hay dây đai nào giống nhau sau 2 năm sử dụng.

Sợi cordura 500D được dệt với mật độ cao, chịu được mài mòn gấp 10 lần vải thông thường. Đây là chất liệu quân dụng — chúng tôi đưa vào thời trang vì nó không nói dối.

Kim loại YKK từ Nhật Bản: khóa kéo không bị kẹt sau 20.000 lần kéo thử nghiệm trong phòng lab của họ. Một con số nhỏ trên nhãn, một cam kết lớn trong thực tế.

Tổng chi phí vật liệu trên một sản phẩm Vibe Urban cao hơn trung bình ngành 40%. Chúng tôi không xin lỗi vì điều đó.`,
  },
  {
    num: "02",
    bg: "#004be3",
    textDark: false,
    title: "Đường khâu tay",
    summary: "Mọi phụ kiện da đều có ít nhất một đường khâu tay. Có thể chậm — nhưng bền.",
    detail: `Một thợ lành nghề của chúng tôi mất 45 phút để hoàn thiện một đường saddle stitch trên dây đai da rộng 3cm. Máy khâu công nghiệp làm điều đó trong 3 phút.

Chúng tôi chọn 45 phút.

Đường khâu tay saddle stitch dùng hai kim, hai đầu chỉ — mỗi mũi khâu đan chéo nhau tạo thành chữ X. Nếu một bên chỉ đứt, bên kia vẫn giữ nguyên. Máy khâu tạo ra vòng lặp chuỗi — đứt một điểm là tuột cả đoạn.

Chỉ khâu được tẩm sáp ong tự nhiên trước khi dùng, giúp chống nước và tăng độ bền lên gấp đôi. Màu chỉ được chọn để đồng điệu với màu da sau 5 năm lão hóa — không phải màu da khi mới ra xưởng.

Mỗi sản phẩm da của Vibe Urban đều có ít nhất một đường khâu tay có thể nhìn thấy bằng mắt thường. Đó là chữ ký của xưởng. Và là lời hứa.`,
  },
  {
    num: "03",
    bg: "#ffcdd2",
    textDark: true,
    title: "Đánh số 001–120",
    summary: "Bộ giới hạn là giới hạn thật. Hết là hết, không tái bản. Mỗi sản phẩm có thẻ chữ ký.",
    detail: `Số 120 không phải là con số marketing. Đó là số tối đa một thợ da có thể hoàn thiện thủ công trong một tháng mà không cắt bớt bất kỳ bước nào trong quy trình.

Mỗi sản phẩm limited edition đi kèm một thẻ da nhỏ dập nổi số thứ tự và chữ ký tay của người thợ thực hiện. Số 001 và số 120 không khác nhau về chất lượng — nhưng khác nhau về câu chuyện.

Khi một bộ sưu tập hết hàng, nó hết thật. Chúng tôi không "mở thêm một đợt nhỏ" hay "tái bản theo yêu cầu". Nếu bạn bỏ lỡ, bạn bỏ lỡ — và điều đó khiến người sở hữu trân trọng hơn những gì họ có.

Chúng tôi tin rằng khan hiếm có đạo đức khác hoàn toàn với khan hiếm nhân tạo. Một là sự thật, một là thao túng. Chúng tôi chỉ làm sự thật.`,
  },
  {
    num: "04",
    bg: "#c8e6c9",
    textDark: true,
    title: "Bảo hành 05 năm",
    summary: "Đường khâu hay đế giày bị bung trong 05 năm? Mang ra cửa hàng — chúng tôi vá lại.",
    detail: `Chính sách bảo hành 5 năm của chúng tôi không có điều khoản ẩn. Nếu sản phẩm hỏng vì lỗi sản xuất trong 5 năm, chúng tôi sửa miễn phí — không hỏi nhiều.

Định nghĩa "lỗi sản xuất" của chúng tôi rộng hơn tiêu chuẩn ngành: đường khâu bung, da nứt bất thường, khóa hỏng, đế tách. Chúng tôi không tranh luận về ranh giới mà hành xử theo hướng có lợi cho khách hàng.

Tại sao chúng tôi dám làm vậy? Vì chúng tôi tin vào chất liệu và thợ của mình. Tỷ lệ bảo hành thực tế trong 3 năm qua của Vibe Urban dưới 2%. Không phải vì chúng tôi từ chối — mà vì sản phẩm ít hỏng.

Khi đem đồ đến bảo hành, bạn sẽ gặp trực tiếp thợ sửa — không phải nhân viên CSKH. Họ sẽ cho bạn biết cần làm gì, mất bao lâu, và tại sao nó hỏng. Minh bạch là một phần của bảo hành.`,
  },
];

export default function PhilosophySection() {
  const [activeIdx, setActiveIdx] = useState(null);
  const active = activeIdx !== null ? CARDS[activeIdx] : null;

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-t border-black/10">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-8 mb-12">
        <div className="max-w-2xl">
          <div className="inline-block border border-black/10 bg-[#0f172a] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white mb-6 rounded-full">
            02 - Bốn điều chúng tôi tin
          </div>
          <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1] text-[#0f172a]">
            Triết lý <span className="text-[#ff6b35] italic font-serif lowercase">của xưởng.</span>
          </h2>
        </div>
        <div className="max-w-xs text-sm text-[#5c5b5b] font-medium leading-relaxed">
          Không slogan. Không khẩu hiệu. Chỉ là bốn điều chúng tôi tự nhắc mình mỗi sáng, trước khi mở cửa xưởng.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CARDS.map((card, idx) => {
          const dark = card.textDark;
          return (
            <div
              key={card.num}
              onClick={() => setActiveIdx(idx)}
              className="rounded-4xl p-8 flex flex-col justify-between min-h-80 group relative overflow-hidden transition-transform hover:-translate-y-2 cursor-pointer"
              style={{ backgroundColor: card.bg }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-110"
                style={{ backgroundColor: dark ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)" }}
              />
              <div>
                <div className="flex items-center justify-between mb-8"
                  style={{ color: dark ? "#0f172a" : "white" }}
                >
                  <span className="text-3xl font-extrabold">{card.num}</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: dark ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)" }}
                  >+</div>
                </div>
                <h3 className="text-3xl font-extrabold mb-4 tracking-tight"
                  style={{ color: dark ? "#0f172a" : "white" }}
                >
                  {card.title}
                </h3>
                <p className="text-sm font-medium leading-relaxed"
                  style={{ color: dark ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.85)" }}
                >
                  {card.summary}
                </p>
              </div>
              <button
                className="text-[10px] font-bold uppercase tracking-widest text-left mt-8 flex items-center gap-2 transition"
                style={{ color: dark ? "rgba(15,23,42,0.65)" : "rgba(255,255,255,0.75)" }}
              >
                <span style={{ color: dark ? "#0f172a" : "white" }}>↘</span> Đọc thêm
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
          onClick={() => setActiveIdx(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-4xl p-8 sm:p-12 shadow-2xl overflow-y-auto max-h-[90vh]"
            style={{ backgroundColor: active.bg }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setActiveIdx(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition hover:scale-110"
              style={{ backgroundColor: active.textDark ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.2)" }}
            >
              <X className="w-5 h-5" style={{ color: active.textDark ? "#0f172a" : "white" }} />
            </button>

            {/* Number */}
            <span className="text-6xl font-extrabold opacity-20 select-none leading-none"
              style={{ color: active.textDark ? "#0f172a" : "white" }}
            >
              {active.num}
            </span>

            {/* Title */}
            <h3 className="mt-4 font-heading text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight"
              style={{ color: active.textDark ? "#0f172a" : "white" }}
            >
              {active.title}
            </h3>

            {/* Divider */}
            <div className="mt-6 mb-6 h-px w-16"
              style={{ backgroundColor: active.textDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.4)" }}
            />

            {/* Body */}
            <div className="space-y-4">
              {active.detail.trim().split("\n\n").map((para, i) => (
                <p key={i} className="text-sm sm:text-base font-medium leading-relaxed"
                  style={{ color: active.textDark ? "rgba(15,23,42,0.80)" : "rgba(255,255,255,0.90)" }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
