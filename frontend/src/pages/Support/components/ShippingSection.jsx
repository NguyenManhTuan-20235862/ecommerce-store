import { CheckCircle2, Package, RefreshCw, Shield, Truck } from "lucide-react";

const SHIPPING_ZONES = [
  { area: "TP.HCM — nội thành", time: "2–4 giờ", fee: "Miễn phí (đơn > 500k)", highlight: true },
  { area: "TP.HCM — ngoại thành", time: "1–2 ngày", fee: "25.000đ" },
  { area: "Hà Nội, Đà Nẵng", time: "2–3 ngày", fee: "30.000đ" },
  { area: "Các tỉnh còn lại", time: "3–5 ngày", fee: "35.000đ" },
];

const SHIPPING_STEPS = [
  { icon: Package, label: "Đặt hàng", desc: "Chọn sản phẩm & thanh toán" },
  { icon: CheckCircle2, label: "Xác nhận", desc: "Trong vòng 1–2 giờ" },
  { icon: Truck, label: "Đang giao", desc: "Cập nhật tracking thực tế" },
  { icon: Shield, label: "Nhận hàng", desc: "Kiểm tra trước khi ký nhận" },
];

const RETURN_CONDITIONS = [
  {
    icon: "⏱",
    title: "Trong 30 ngày",
    desc: "Kể từ ngày nhận hàng theo dấu bưu phẩm.",
  },
  {
    icon: "🏷",
    title: "Còn nguyên tem nhãn",
    desc: "Chưa qua sử dụng, không bị dính bẩn hay hư hỏng.",
  },
  {
    icon: "🔄",
    title: "Đổi size miễn phí",
    desc: "1 lần — ship 2 chiều do Vibe Urban chịu.",
  },
];

const RETURN_STEPS = [
  { num: "01", title: "Liên hệ CSKH", desc: "Hotline 1800 9090 hoặc Zalo 0901 234 567 để tạo yêu cầu đổi trả." },
  { num: "02", title: "Gửi hàng về", desc: "Đóng gói kỹ và gửi về địa chỉ xưởng Tôn Đản, Quận 4, TP.HCM." },
  { num: "03", title: "Nhận kết quả", desc: "Nhận hàng mới hoặc hoàn tiền trong 3–5 ngày làm việc." },
];

export default function ShippingSection() {
  return (
    <section
      id="shipping"
      className="border-t border-black/10 bg-white scroll-mt-28"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14">
          <div className="inline-block bg-[#ff6b35] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white mb-4 rounded-full">
            02 · Giao hàng & Đổi trả
          </div>
          <h2 className="font-extrabold text-4xl sm:text-5xl tracking-tight text-[#0f172a] leading-tight">
            Chính sách{" "}
            <span className="text-[#004be3] italic font-serif lowercase">vận chuyển</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* ── Cột trái: Giao hàng ────────────────── */}
          <div>
            <h3 className="font-bold text-xl text-[#0f172a] mb-8 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#004be3]" />
              Giao hàng
            </h3>

            {/* Timeline */}
            <div className="relative flex items-start gap-0 mb-10">
              {SHIPPING_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex-1 flex flex-col items-center relative">
                    {/* Connector line */}
                    {i < SHIPPING_STEPS.length - 1 && (
                      <div className="absolute top-5 left-1/2 w-full h-[2px] bg-gradient-to-r from-[#004be3] to-[#819BFF]" />
                    )}
                    <div className="relative z-10 w-10 h-10 rounded-full bg-[#004be3] flex items-center justify-center shadow-md shadow-blue-200 mb-3">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-[#0f172a] font-bold text-[11px] uppercase tracking-wide text-center">{step.label}</p>
                    <p className="text-[#5c5b5b] text-[10px] text-center mt-0.5 leading-tight px-1">{step.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Shipping Zones Table */}
            <div className="rounded-2xl overflow-hidden border border-black/8">
              <div className="bg-[#0f172a] px-5 py-3">
                <p className="text-white text-[11px] font-bold uppercase tracking-widest">Bảng phí & thời gian</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f9f6f5]">
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5c5b5b]">Khu vực</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5c5b5b]">Thời gian</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5c5b5b]">Phí</th>
                  </tr>
                </thead>
                <tbody>
                  {SHIPPING_ZONES.map((zone, i) => (
                    <tr
                      key={zone.area}
                      className={`border-t border-black/5 ${zone.highlight ? "bg-blue-50" : i % 2 === 0 ? "bg-white" : "bg-[#fafaf9]"}`}
                    >
                      <td className="px-5 py-3.5 font-medium text-[#0f172a] text-[13px]">
                        {zone.highlight && (
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#004be3] mr-2 -mt-0.5 align-middle" />
                        )}
                        {zone.area}
                      </td>
                      <td className="px-4 py-3.5 text-[#5c5b5b] text-[13px]">{zone.time}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[12px] font-semibold ${zone.highlight ? "text-[#004be3]" : "text-[#0f172a]"}`}>
                          {zone.fee}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[#5c5b5b] text-[11px] mt-3 leading-relaxed">
              * Thời gian trên tính từ lúc đơn hàng được xác nhận xử lý, không tính ngày lễ và cuối tuần với đơn tỉnh.
            </p>
          </div>

          {/* ── Cột phải: Đổi & Trả ─────────────────── */}
          <div>
            <h3 className="font-bold text-xl text-[#0f172a] mb-8 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#ff6b35]" />
              Đổi & Trả
            </h3>

            {/* Điều kiện */}
            <div className="space-y-3 mb-10">
              {RETURN_CONDITIONS.map((cond) => (
                <div
                  key={cond.title}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-[#f9f6f5] border border-black/5 hover:border-black/10 transition"
                >
                  <span className="text-2xl mt-0.5">{cond.icon}</span>
                  <div>
                    <p className="font-bold text-[#0f172a] text-sm mb-0.5">{cond.title}</p>
                    <p className="text-[#5c5b5b] text-[13px] leading-relaxed">{cond.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quy trình 3 bước */}
            <div className="bg-[#0f172a] rounded-3xl p-6">
              <p className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Quy trình đổi trả</p>
              <div className="space-y-0">
                {RETURN_STEPS.map((step, i) => (
                  <div key={step.num} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#004be3] flex items-center justify-center shrink-0">
                        <span className="text-white text-[10px] font-extrabold">{step.num}</span>
                      </div>
                      {i < RETURN_STEPS.length - 1 && (
                        <div className="w-[2px] h-8 bg-white/10 my-1" />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="text-white font-bold text-sm mb-1">{step.title}</p>
                      <p className="text-white/50 text-[13px] leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exception note */}
            <div className="mt-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-700 text-[12px] leading-relaxed">
                <span className="font-bold">Lưu ý:</span> Sản phẩm sale từ 50% trở lên, đồ lót và phụ kiện cá nhân không áp dụng đổi trả.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
