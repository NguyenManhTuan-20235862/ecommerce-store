export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-10">
        <div className="space-y-3">
          <p className="text-xs font-extrabold uppercase tracking-tight text-[#2f2f2e]">
            VIBE URBAN
          </p>
          <p className="max-w-xs text-[12px] leading-relaxed text-[#5c5b5b]">
            Nền tảng thời trang đường phố dành cho người thích khác biệt, tối
            giản và hiện đại.
          </p>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2f2f2e]">
            Bộ sưu tập
          </p>
          <ul className="space-y-2 text-[12px] text-[#5c5b5b]">
            <li>
              <a href="/shop" className="hover:text-[#004be3]">
                Hàng mới
              </a>
            </li>
            <li>
              <a href="/shop" className="hover:text-[#004be3]">
                Nổi bật tuần này
              </a>
            </li>
            <li>
              <a href="/shop" className="hover:text-[#004be3]">
                Streetwear Core
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2f2f2e]">
            Hỗ trợ
          </p>
          <ul className="space-y-2 text-[12px] text-[#5c5b5b]">
            <li>
              <a href="#" className="hover:text-[#004be3]">
                Giao hàng & đổi trả
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#004be3]">
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#004be3]">
                Liên hệ
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2f2f2e]">
            Pulse Newsletter
          </p>
          <div className="flex overflow-hidden rounded-full border border-black/10 bg-[#f3f0ef] p-1">
            <input
              type="email"
              placeholder="Email của bạn"
              className="h-9 flex-1 bg-transparent px-3 text-[12px] text-[#2f2f2e] outline-none placeholder:text-[#afadac]"
            />
            <button className="rounded-full bg-[#004be3] px-4 text-[11px] font-semibold uppercase tracking-wide text-white">
              Đăng ký
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-black/5 py-3">
        <p className="text-center text-[11px] text-[#afadac]">
          © 2026 VIBE URBAN. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
