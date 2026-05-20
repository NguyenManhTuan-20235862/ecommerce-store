export default function PhilosophySection() {
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
        {/* Card 1 */}
        <div className="bg-[#ff6b35] rounded-[2rem] p-8 flex flex-col justify-between min-h-[320px] group relative overflow-hidden transition-transform hover:-translate-y-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-110"></div>
          <div>
            <div className="flex items-center justify-between mb-8 text-white">
              <span className="text-3xl font-extrabold">01</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">+</div>
            </div>
            <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Chất liệu sống</h3>
            <p className="text-white/90 text-sm font-medium leading-relaxed">
              Da bò veg-tan, sợi cordura, kim loại YKK. Già đi đẹp, không cũ đi xấu.
            </p>
          </div>
          <button className="text-white/80 text-[10px] font-bold uppercase tracking-widest text-left mt-8 flex items-center gap-2 group-hover:text-white transition">
            <span className="text-white">↘</span> Đọc thêm
          </button>
        </div>

        {/* Card 2 */}
        <div className="bg-[#004be3] rounded-[2rem] p-8 flex flex-col justify-between min-h-[320px] group relative overflow-hidden transition-transform hover:-translate-y-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-110"></div>
          <div>
            <div className="flex items-center justify-between mb-8 text-white">
              <span className="text-3xl font-extrabold">02</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">+</div>
            </div>
            <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Đường khâu tay</h3>
            <p className="text-white/90 text-sm font-medium leading-relaxed">
              Mọi phụ kiện da đều có ít nhất một đường khâu tay. Có thể chậm — nhưng bền.
            </p>
          </div>
          <button className="text-white/80 text-[10px] font-bold uppercase tracking-widest text-left mt-8 flex items-center gap-2 group-hover:text-white transition">
            <span className="text-white">↘</span> Đọc thêm
          </button>
        </div>

        {/* Card 3 */}
        <div className="bg-[#ffcdd2] rounded-[2rem] p-8 flex flex-col justify-between min-h-[320px] group relative overflow-hidden transition-transform hover:-translate-y-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-110"></div>
          <div>
            <div className="flex items-center justify-between mb-8 text-[#0f172a]">
              <span className="text-3xl font-extrabold">03</span>
              <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center text-[#0f172a] text-xs font-bold">+</div>
            </div>
            <h3 className="text-3xl font-extrabold text-[#0f172a] mb-4 tracking-tight">Đánh số 001–120</h3>
            <p className="text-[#0f172a]/80 text-sm font-medium leading-relaxed">
              Bộ giới hạn là giới hạn thật. Hết là hết, không tái bản. Mỗi sản phẩm có thẻ chữ ký.
            </p>
          </div>
          <button className="text-[#0f172a]/70 text-[10px] font-bold uppercase tracking-widest text-left mt-8 flex items-center gap-2 group-hover:text-[#0f172a] transition">
            <span className="text-[#0f172a]">↘</span> Đọc thêm
          </button>
        </div>

        {/* Card 4 */}
        <div className="bg-[#c8e6c9] rounded-[2rem] p-8 flex flex-col justify-between min-h-[320px] group relative overflow-hidden transition-transform hover:-translate-y-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-110"></div>
          <div>
            <div className="flex items-center justify-between mb-8 text-[#0f172a]">
              <span className="text-3xl font-extrabold">04</span>
              <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center text-[#0f172a] text-xs font-bold">+</div>
            </div>
            <h3 className="text-3xl font-extrabold text-[#0f172a] mb-4 tracking-tight">Bảo hành 05 năm</h3>
            <p className="text-[#0f172a]/80 text-sm font-medium leading-relaxed">
              Đường khâu hay đế giày bị bung trong 05 năm? Mang ra cửa hàng — chúng tôi vá lại.
            </p>
          </div>
          <button className="text-[#0f172a]/70 text-[10px] font-bold uppercase tracking-widest text-left mt-8 flex items-center gap-2 group-hover:text-[#0f172a] transition">
            <span className="text-[#0f172a]">↘</span> Đọc thêm
          </button>
        </div>
      </div>
    </section>
  );
}
