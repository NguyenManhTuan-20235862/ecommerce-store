export default function WorkshopSection() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      <div className="bg-[#1e293b] rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Left Content */}
        <div className="flex-1 max-w-xl text-white">
          <div className="inline-block bg-[#ff6b35] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white mb-8 rounded-full">
            03 - Xưởng
          </div>

          <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1] mb-8">
            <span className="text-[#ffcdd2] italic font-serif lowercase">Sáu ngày</span> để hoàn thành một đôi giày.
          </h2>

          <p className="text-white/80 text-base leading-relaxed font-medium mb-12">
            14 đồng nghiệp ở hai xưởng — Sài Gòn (Q.04) và Hà Nội (Đống Đa). Mọi sản phẩm da đi qua sáu bàn: cắt, ghép, khâu, đánh số, kiểm tra, đóng gói.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-3xl font-extrabold mb-1">98.4%</p>
              <p className="text-xs text-white/60 font-medium">QC pass rate</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-3xl font-extrabold mb-1">06 ngày</p>
              <p className="text-xs text-white/60 font-medium">Trung bình / đơn</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-3xl font-extrabold mb-1">14 người</p>
              <p className="text-xs text-white/60 font-medium">Đồng nghiệp</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-3xl font-extrabold mb-1">60%<span className="text-xl">+</span></p>
              <p className="text-xs text-white/60 font-medium">Nguyên liệu nội địa</p>
            </div>
          </div>

          <button className="bg-[#ff6b35] text-white px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-[#e85b2a] transition">
            Đặt lịch ghé xưởng →
          </button>
        </div>

        {/* Right Images (Process Grid) */}
        <div className="flex-1 w-full grid grid-cols-6 grid-rows-2 gap-4 h-[500px] lg:h-[600px]">
          {/* Cắt rập (Large left) */}
          <div className="col-span-3 row-span-2 relative bg-white/5 rounded-[2rem] overflow-hidden group border border-white/10">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
            <div className="absolute top-4 left-4 z-10">
              <div className="inline-block bg-[#ffcdd2] px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#0f172a] rounded-full">
                ✦ cắt
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">CẮT RẬP DA BÒ</p>
            </div>
          </div>

          {/* Khâu (Top right) */}
          <div className="col-span-3 row-span-1 relative bg-white/5 rounded-[2rem] overflow-hidden group border border-white/10">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
            <div className="absolute top-4 left-4 z-10">
              <div className="inline-block bg-[#c8e6c9] px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#0f172a] rounded-full">
                ✦ khâu
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">KHÂU SOLE TAY</p>
            </div>
          </div>

          {/* Đánh số (Bottom mid-left) */}
          <div className="col-span-1 row-span-1 relative bg-white/5 rounded-[2rem] overflow-hidden group border border-white/10">
            <div className="absolute top-4 left-4 z-10">
              <div className="inline-block bg-[#ff6b35] px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white rounded-full">
                ✦ số
              </div>
            </div>
          </div>

          {/* QC (Bottom mid-right) */}
          <div className="col-span-1 row-span-1 relative bg-white/5 rounded-[2rem] overflow-hidden group border border-white/10">
            <div className="absolute top-4 left-4 z-10">
              <div className="inline-block bg-[#004be3] px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white rounded-full">
                ✦ kiểm
              </div>
            </div>
          </div>

          {/* Gói (Bottom right) */}
          <div className="col-span-1 row-span-1 relative bg-white/5 rounded-[2rem] overflow-hidden group border border-white/10">
            <div className="absolute top-4 left-4 z-10">
              <div className="inline-block bg-[#f3f0ef] px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-[#0f172a] rounded-full">
                ✦ gói
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
