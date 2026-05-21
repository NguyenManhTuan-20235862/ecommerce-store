import { useEffect, useState } from "react";
import { siteConfigService } from "../../../services/siteConfig.service";

export default function ContactSection() {
  const [config, setConfig] = useState({ hotline: "", email: "", zalo: "", press: "" });

  useEffect(() => {
    siteConfigService
      .getConfig()
      .then((res) => {
        const d = res.data?.data ?? {};
        setConfig({
          hotline: d.hotline ?? "",
          email: d.email ?? "",
          zalo: d.zalo ?? "",
          press: d.press ?? "",
        });
      })
      .catch(() => {});
  }, []);

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      <div className="bg-[#1e293b] rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row gap-16">

        {/* Left Content */}
        <div className="flex-1 text-white">
          <div className="inline-block bg-[#ff6b35] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white mb-8 rounded-full">
            07 - Liên hệ
          </div>

          <h2 className="font-heading text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1] mb-12">
            Nói chuyện với <span className="italic font-serif lowercase">chúng tôi.</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="inline-block bg-[#ff6b35] px-2 py-0.5 rounded-md text-[9px] font-bold uppercase text-white mb-2">Hotline</div>
              <p className="text-xl font-extrabold text-white">{config.hotline || "—"}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="inline-block bg-[#ffcdd2] px-2 py-0.5 rounded-md text-[9px] font-bold uppercase text-[#0f172a] mb-2">Email</div>
              <p className="text-xl font-extrabold text-white">{config.email || "—"}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="inline-block bg-[#004be3] px-2 py-0.5 rounded-md text-[9px] font-bold uppercase text-white mb-2">Zalo OA</div>
              <p className="text-xl font-extrabold text-white">{config.zalo || "—"}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="inline-block bg-[#c8e6c9] px-2 py-0.5 rounded-md text-[9px] font-bold uppercase text-[#0f172a] mb-2">Báo chí</div>
              <p className="text-xl font-extrabold text-white">{config.press || "—"}</p>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 bg-[#0f172a] border border-white/10 rounded-[2rem] p-8 md:p-10">
          <div className="inline-block bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0f172a] mb-6 rounded-full">
            ✦ Form liên hệ
          </div>

          <h3 className="text-3xl font-extrabold text-white mb-8 tracking-tight">Gửi cho bọn mình vài dòng.</h3>

          <div className="flex flex-wrap gap-2 mb-8">
            <button className="bg-[#ff6b35] text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">Đơn hàng</button>
            <button className="bg-white/5 border border-white/10 text-white/70 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition">Sản phẩm</button>
            <button className="bg-white/5 border border-white/10 text-white/70 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition">Cộng tác</button>
            <button className="bg-white/5 border border-white/10 text-white/70 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition">Báo chí</button>
            <button className="bg-white/5 border border-white/10 text-white/70 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition">Khác</button>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2">Họ và tên</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2">Email / SĐT</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2">Nội dung</label>
              <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition resize-none"></textarea>
            </div>
            <button type="button" className="w-full bg-white text-[#0f172a] px-6 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-gray-200 transition">
              Gửi tin nhắn →
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
