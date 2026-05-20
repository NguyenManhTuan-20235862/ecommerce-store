export default function FaqNewsletterSection() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pt-8 pb-16 sm:px-6 lg:px-8 border-t border-black/10">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
        
        {/* FAQ */}
        <div className="flex-1 min-w-0">
          <div className="inline-block border border-black/10 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-[#94a3b8] mb-4 rounded-full">
            HỎI & ĐÁP NGẮN
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#0f172a] mb-8 break-words">
            Trước khi <span className="italic font-serif lowercase">bấm mua.</span>
          </h2>

          <div className="flex flex-col gap-3">
            {[
              "Mã có cộng dồn không?",
              "Hàng sale có đổi trả?",
              "Khi nào ship?"
            ].map((q, i) => (
              <div key={i} className="border border-black/10 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-[#004be3] transition">
                <span className="font-bold text-sm text-[#0f172a] truncate">{q}</span>
                <span className="text-[#94a3b8] flex-shrink-0">+</span>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex-1 min-w-0">
          <div className="inline-block border border-black/10 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-[#94a3b8] mb-4 rounded-full">
            ĐĂNG KÝ NHẬN ƯU ĐÃI
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#0f172a] mb-8 break-words">
            Không bỏ lỡ <span className="italic font-serif lowercase">đợt sale.</span>
          </h2>

          <div className="bg-white border border-black/10 p-2 rounded-full flex items-center gap-2 mb-3">
            <input 
              type="email" 
              placeholder="ten@cua.ban" 
              className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-medium text-[#0f172a] placeholder:text-[#94a3b8]"
            />
            <button className="bg-[#0f172a] text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black transition whitespace-nowrap">
              ĐĂNG KÝ
            </button>
          </div>
          <p className="text-[10px] text-[#94a3b8] ml-4">
            Không spam — bỏ đăng ký bất cứ lúc nào.
          </p>
        </div>

      </div>
    </section>
  );
}
