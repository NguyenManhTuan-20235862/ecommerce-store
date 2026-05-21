const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export default function HeroSection() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pt-12 pb-16 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">
        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="inline-block border border-black/10 bg-[#0f172a] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white mb-8 rounded-full self-start">
            ✦ Về chúng tôi - est. 2019
          </div>

          <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.9] text-[#0f172a] mb-8 max-w-2xl">
            Một{" "}
            <span className="text-[#ff6b35] italic font-serif lowercase">
              xưởng
            </span>{" "}
            nhỏ, <br />
            cho phái{" "}
            <span className="text-[#004be3] italic font-serif lowercase">
              mạnh.
            </span>
          </h1>

          <p className="text-[#5c5b5b] text-base sm:text-lg max-w-xl mb-10 leading-relaxed font-medium">
            solar. là một studio phụ kiện & giày nam ở Sài Gòn — chúng tôi tin
            vào chất liệu sống, đường khâu tay, và những lần đi bộ dài trong
            nắng vàng. Mỗi sản phẩm là một mảnh nhỏ của một ngày đẹp trời.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-16">
            <button
              onClick={() => scrollToSection("stores-section")}
              className="bg-[#0f172a] text-white px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-black transition"
            >
              Tìm cửa hàng →
            </button>
            <button
              onClick={() => scrollToSection("story-section")}
              className="bg-transparent border border-black/10 text-[#0f172a] px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-white transition"
            >
              Đọc câu chuyện ↓
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-200/50 to-transparent rounded-full blur-2xl -z-10 w-64 h-32 opacity-50"></div>

            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0f172a]">
                07
              </span>
              <span className="text-[10px] sm:text-xs text-[#5c5b5b] font-medium uppercase tracking-wider">
                năm
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0f172a]">
                04
              </span>
              <span className="text-[10px] sm:text-xs text-[#5c5b5b] font-medium uppercase tracking-wider">
                cửa hàng
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0f172a]">
                148
              </span>
              <span className="text-[10px] sm:text-xs text-[#5c5b5b] font-medium uppercase tracking-wider">
                sản phẩm
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0f172a]">
                240K
              </span>
              <span className="text-[10px] sm:text-xs text-[#5c5b5b] font-medium uppercase tracking-wider">
                thành viên
              </span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 relative min-h-[500px] lg:min-h-0 bg-[#e2e8f0] rounded-[2rem] overflow-hidden group">
          <div className="absolute top-4 left-4 z-10">
            <div className="inline-block bg-white/90 backdrop-blur px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0f172a] rounded-full">
              ✦ Saigon Flagship
            </div>
          </div>

          <img
            src="src/assets/vibe-urban-v2.jpg"
            alt="Cửa hàng Vibe Urban"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/70 font-medium">
                17:42 · Thứ Bảy
              </span>
              <span className="text-lg font-bold">28 Tôn Đản, Q.04</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
