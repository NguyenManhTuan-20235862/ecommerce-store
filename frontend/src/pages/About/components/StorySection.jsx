export default function StorySection() {
  return (
    <section
      id="story-section"
      className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-t border-black/10"
    >
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Left Content */}
        <div className="flex-1 max-w-xl">
          <div className="inline-block bg-[#ff6b35] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white mb-6 rounded-full">
            01 - Câu chuyện
          </div>

          <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1] text-[#0f172a] mb-8">
            Bắt đầu từ một{" "}
            <span className="text-[#ff6b35] italic font-serif lowercase">
              cái bàn gỗ
            </span>{" "}
            ở Q.04.
          </h2>

          <div className="space-y-6 text-[#5c5b5b] text-base leading-relaxed font-medium mb-10">
            <p>
              Năm 2019, ba người bạn — một thợ da, một họa sĩ, một kỹ sư — góp
              tiền thuê một căn phòng 24m² ở Tôn Đản. Cái bàn dài 2.4m, hai cái
              đèn vàng, một con mèo tên Đậu. Sản phẩm đầu tiên là một chiếc ví
              da ngắn được làm hoàn toàn bằng tay — bán hết 32 chiếc trong 03
              ngày.
            </p>
            <p>
              Bảy năm sau, vẫn căn phòng đó, vẫn cái bàn đó, vẫn con mèo đó —
              chỉ có thêm 13 đồng nghiệp, 04 cửa hàng, và một danh sách dài
              những khách quay lại.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-red-100 text-red-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
              ✦ Thợ da
            </div>
            <div className="bg-green-100 text-green-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
              ✦ Họa sĩ
            </div>
            <div className="bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
              ✦ Kỹ sư
            </div>
            <div className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
              ✦ Đậu, con mèo
            </div>
          </div>
        </div>

        {/* Right Images */}
        <div className="flex-1 w-full grid grid-cols-2 grid-rows-2 gap-4 h-[500px] lg:h-[600px]">
          {/* Top Large Image */}
          <div className="col-span-2 row-span-1 relative bg-[#e2e8f0] rounded-[2rem] overflow-hidden group">
            <img
              src="src/assets/about.png"
              alt="Xưởng 2019"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
            <div className="absolute top-4 left-4 z-10">
              <div className="inline-block bg-[#0f172a] px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white rounded-full">
                2019 · ngày 01
              </div>
            </div>
          </div>

          {/* Bottom Left Image */}
          <div className="col-span-1 row-span-1 relative bg-[#ffdcce] rounded-[2rem] overflow-hidden group">
            <img
              src="src/assets/Store1.jpg"
              alt="Cửa hàng 2021"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 z-10">
              <div className="inline-block bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#0f172a] rounded-full shadow-sm">
                2021
              </div>
            </div>
          </div>

          {/* Bottom Right Image */}
          <div className="col-span-1 row-span-1 relative bg-[#cce0ff] rounded-[2rem] overflow-hidden group">
            <img
              src="src/assets/Store4.jpg"
              alt="Cửa hàng Hải Phòng"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 z-10">
              <div className="inline-block bg-[#004be3] px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white rounded-full shadow-sm">
                2026 - mới
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
