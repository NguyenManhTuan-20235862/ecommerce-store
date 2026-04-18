import {
  ArrowRight,
  ChevronRight,
  Globe,
  Mail,
  Menu,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router";

const drops = [
  {
    title: "Kinetic Pulse Tee",
    category: "Streetwear / Tops",
    price: "450.000đ",
    badge: "Essential",
    tone: "from-[#1a1a1e] via-[#21212a] to-[#3a1f7a]",
  },
  {
    title: "Urban Nomad Cargo",
    category: "Streetwear / Bottoms",
    price: "890.000đ",
    badge: "Limited",
    tone: "from-[#f4efe9] via-[#a4a0a6] to-[#5d535f]",
  },
  {
    title: "Neon Signal Hoodie",
    category: "Streetwear / Hoodies",
    price: "720.000đ",
    badge: "New Drop",
    tone: "from-[#111827] via-[#0f172a] to-[#0b8f4a]",
  },
  {
    title: "District Sling Bag",
    category: "Accessories / Gear",
    price: "380.000đ",
    badge: "Gear",
    tone: "from-[#d7c0a7] via-[#8d6a51] to-[#322118]",
  },
];

const trendCards = [
  {
    title: "Hard-grit Accessories",
    subtitle: "34 sản phẩm sẵn có",
    tone: "from-[#1a1a1e] via-[#292733] to-[#543f25]",
  },
  {
    title: "Neon Outerwear",
    subtitle: "Bộ sưu tập giới hạn",
    tone: "from-[#004be3] via-[#2f66ff] to-[#89a4ff]",
  },
];

const categories = ["Áo khoác", "Áo thun", "Quần dài", "Giày & sneaker"];

const footerLinks = ["Bộ sưu tập", "Câu chuyện", "Cửa hàng", "Liên hệ"];

function ProductCard({ title, category, price, badge, tone }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_20px_50px_rgba(47,47,46,0.08)] transition duration-300 hover:-translate-y-px hover:shadow-[0_30px_70px_rgba(47,47,46,0.12)]">
      <div
        className={`relative aspect-4/3 overflow-hidden bg-linear-to-br ${tone}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.38),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(129,155,255,0.28),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.12),rgba(0,0,0,0.1))]" />
        <div className="absolute left-4 top-4 rounded-full bg-[#004be3] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
          {badge}
        </div>
        <div className="absolute inset-x-6 bottom-6 h-20 rounded-[1.25rem] border border-white/20 bg-white/10 backdrop-blur-sm" />
      </div>

      <div className="space-y-2 p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#71717a]">
          {category}
        </p>
        <div className="flex items-end justify-between gap-4">
          <h3 className="text-[1.05rem] font-bold tracking-[-0.03em] text-[#2f2f2e]">
            {title}
          </h3>
          <span className="text-lg font-extrabold tracking-[-0.04em] text-[#004be3]">
            {price}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function Landing() {
  return (
    <main className="overflow-hidden bg-[#f9f6f5] text-[#2f2f2e]">
      <section className="relative px-4 pb-11 pt-4 sm:px-6 sm:pb-14 lg:px-10 lg:pb-20 lg:pt-6">
        <div className="mx-auto flex w-full max-w-400 items-center justify-between rounded-full border border-black/5 bg-white/75 px-4 py-2.5 backdrop-blur-md sm:px-6 sm:py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#004be3] text-sm font-black uppercase text-white shadow-[0_12px_24px_rgba(0,75,227,0.22)]">
              VU
            </div>
            <div>
              <p className="font-heading text-[13px] font-extrabold uppercase tracking-[0.2em] sm:text-sm sm:tracking-[0.22em]">
                VIBE URBAN
              </p>
              <p className="text-[11px] text-[#5c5b5b] sm:text-xs">
                Trang phục nam hiện đại
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#5c5b5b] lg:flex">
            <a href="#drops" className="transition hover:text-[#004be3]">
              Bộ mới
            </a>
            <a href="#trending" className="transition hover:text-[#004be3]">
              Xu hướng
            </a>
            <a href="#lookbook" className="transition hover:text-[#004be3]">
              Lookbook
            </a>
            <a href="#footer" className="transition hover:text-[#004be3]">
              Liên hệ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[#2f2f2e] transition hover:border-[#004be3]/30 hover:text-[#004be3] sm:inline-flex"
            >
              Đăng nhập
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-[#004be3] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#003cc0]"
            >
              Khám phá
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-[#2f2f2e] lg:hidden"
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative mx-auto mt-5 grid w-full max-w-400 gap-4.5 sm:mt-6 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-4xl border border-black/5 bg-white/70 p-5 shadow-[0_32px_90px_rgba(47,47,46,0.08)] backdrop-blur-sm sm:p-7 lg:p-10 xl:p-11">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#004be3]">
              Available now
            </p>

            <div className="mt-4 max-w-4xl font-heading text-[clamp(2.45rem,8vw,7.4rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.06em] sm:mt-5">
              <span className="block text-[#2f2f2e]">Fuel your</span>
              <span className="block italic text-[#004be3]">urban</span>
              <span className="block text-[#2f2f2e]">movement</span>
            </div>

            <p className="mt-5 max-w-xl text-[14px] leading-6.5 text-[#5c5b5b] sm:mt-6 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
              Streetwear nam cho nhịp sống nhanh: áo khoác, hoodie, quần cargo
              và phụ kiện được chọn theo tinh thần gọn gàng, mạnh mẽ, dễ mặc mỗi
              ngày.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#004be3_0%,#819bff_100%)] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_12px_24px_rgba(0,75,227,0.16)] transition hover:-translate-y-px hover:brightness-105"
              >
                Mua ngay
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#dfdcdc] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-[#2f2f2e] transition hover:bg-[#d5d1d0]"
              >
                Tạo tài khoản
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-7 grid gap-3 sm:mt-10 sm:grid-cols-3">
              {[
                { value: "01", label: "Ra phố gọn gàng" },
                { value: "24/7", label: "Bộ mới liên tục" },
                { value: "VNĐ", label: "Giá hiển thị rõ ràng" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm"
                >
                  <p className="font-heading text-[1.75rem] font-extrabold tracking-[-0.05em] text-[#2f2f2e] sm:text-3xl">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#5c5b5b]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="pointer-events-none absolute -left-20 top-20 select-none font-heading text-[9rem] font-extrabold italic uppercase tracking-[-0.08em] text-[#2f2f2e] opacity-[0.03] sm:-left-24 sm:text-[18rem]">
              vibe urban vibe urban
            </div>
          </div>

          <div className="relative min-h-140 overflow-hidden rounded-4xl border border-black/5 bg-[#2f2f2e] shadow-[0_32px_90px_rgba(47,47,46,0.16)] sm:min-h-160 lg:min-h-180">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(0,75,227,0.35),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.16))]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.2))]" />
            <div className="absolute left-6 top-6 rounded-full bg-[#00fe66] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#004616] shadow-[0_12px_24px_rgba(0,0,0,0.1)]">
              Drop 04
            </div>
            <div className="absolute right-6 top-6 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80 backdrop-blur">
              Out now
            </div>
            <div className="absolute inset-x-0 top-0 h-[64%] bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0))]" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
              <div className="overflow-hidden rounded-[1.75rem] border border-white/15 bg-black/20 p-5 backdrop-blur-md sm:p-6">
                <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(17,24,39,0.96)_0%,rgba(31,41,55,0.94)_55%,rgba(87,39,174,0.92)_100%)] p-4 sm:p-5 shadow-[0_25px_50px_rgba(0,0,0,0.24)]">
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/70">
                      Featured story
                    </p>
                    <h2 className="mt-3 max-w-md text-[1.45rem] font-extrabold uppercase leading-none tracking-[-0.05em] text-white sm:text-[1.85rem] lg:text-4xl">
                      The Saigon techwear scene
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-7 text-white/75">
                      Câu chuyện thị giác mang hơi thở đô thị, tập trung vào
                      khối lớn, ánh sáng mạnh và cảm giác cao cấp ngay từ cái
                      nhìn đầu tiên.
                    </p>
                    <Link
                      to="/shop"
                      className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/80 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#2f2f2e]"
                    >
                      Xem bộ sưu tập
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="grid gap-3">
                    {[
                      { label: "Trang phục", value: "Top / Bottom / Outer" },
                      { label: "Phong cách", value: "Modern streetwear" },
                      { label: "Màu chủ đạo", value: "Đen, xám, xanh điện" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[1.25rem] border border-white/10 bg-white/10 px-4 py-4 text-white backdrop-blur-sm"
                      >
                        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/60">
                          {item.label}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-white">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="drops"
        className="bg-[#f3f0ef] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-24"
      >
        <div className="mx-auto flex w-full max-w-400 flex-col gap-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#004be3]">
                Available now
              </p>
              <h2 className="mt-3 text-4xl font-extrabold uppercase tracking-[-0.05em] sm:text-5xl">
                New drops
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 self-start text-sm font-bold uppercase tracking-[0.2em] text-[#004be3] transition hover:translate-x-1"
            >
              Xem toàn bộ archive
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {drops.map((drop) => (
              <ProductCard key={drop.title} {...drop} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="trending"
        className="bg-[#f9f6f5] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-24"
      >
        <div className="mx-auto flex w-full max-w-400 flex-col gap-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#004be3]">
              Trending now
            </p>
            <h2 className="mt-3 text-[1.9rem] font-extrabold uppercase tracking-[-0.05em] sm:text-[3.1rem] lg:text-6xl">
              Những khối hình đang lên phố
            </h2>
            <p className="mt-4 text-base leading-8 text-[#71717a] sm:text-lg">
              Bố cục mạnh, ảnh lớn, đối lập rõ ràng và khoảng trắng đủ rộng để
              giữ cảm giác cao cấp theo đúng tinh thần Figma.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
            <article className="relative min-h-110 overflow-hidden rounded-4xl bg-[#111827] shadow-[0_30px_90px_rgba(47,47,46,0.16)] sm:min-h-130 lg:min-h-140">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.75))]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,254,102,0.18),transparent_22%),radial-gradient(circle_at_80%_10%,rgba(0,75,227,0.3),transparent_30%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_42%,rgba(255,255,255,0.04))]" />
              <div className="absolute inset-0 flex items-end p-8 sm:p-10">
                <div className="max-w-xl text-white">
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#00fe66]">
                    Featured story
                  </p>
                  <h3 className="mt-3 text-[2.1rem] font-extrabold uppercase leading-[0.95] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                    The Saigon techwear scene
                  </h3>
                  <p className="mt-4 max-w-lg text-base leading-7 text-white/75">
                    Hình ảnh đậm chất đường phố, dùng mảng màu tối và ánh sáng
                    nhấn để kéo mắt vào sản phẩm và câu chuyện thương hiệu.
                  </p>
                  <Link
                    to="/shop"
                    className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-white px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#2f2f2e]"
                  >
                    Đọc thêm
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>

            <div className="grid gap-5">
              {trendCards.map((card) => (
                <article
                  key={card.title}
                  className={`relative min-h-61.75 overflow-hidden rounded-4xl bg-linear-to-br ${card.tone} p-7 text-white shadow-[0_20px_50px_rgba(47,47,46,0.12)]`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.18),transparent_28%)]" />
                  <div className="relative flex h-full flex-col justify-end">
                    <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/70">
                      Lookbook
                    </p>
                    <h3 className="mt-3 text-3xl font-extrabold uppercase tracking-[-0.05em]">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm uppercase tracking-[0.22em] text-white/75">
                      {card.subtitle}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#004be3] px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-400 overflow-hidden rounded-4xl bg-[#004be3] py-2.5 text-white sm:py-3">
          <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap font-heading text-[1.9rem] font-extrabold uppercase tracking-[-0.04em] sm:text-5xl">
            VIBE URBAN / 24 DROP AVAILABLE NOW / VIBE URBAN / 24 DROP AVAILABLE
            NOW /
          </div>
        </div>
      </section>

      <section
        id="lookbook"
        className="bg-[#f3f0ef] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-24"
      >
        <div className="mx-auto grid w-full max-w-400 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center xl:grid-cols-[0.86fr_1.14fr]">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#004be3]">
              Lookbook
            </p>
            <h2 className="mt-3 font-heading text-[1.95rem] font-extrabold uppercase leading-[0.95] tracking-[-0.05em] sm:text-[3rem] lg:text-[4.2rem]">
              <span className="block">THE URBAN</span>
              <span className="block">CHRONICLES VOL.</span>
              <span className="block">02</span>
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#5c5b5b] sm:text-base lg:max-w-lg lg:text-[1.12rem] lg:leading-8">
              Bộ lookbook cuối trang giữ cảm giác editorial, nhấn vào nhịp ảnh
              lớn, chữ đậm và bố cục thoáng để đưa thương hiệu lên đúng tông cao
              cấp.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#004be3] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#003cc0]"
              >
                Khám phá lookbook
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-[#2f2f2e] transition hover:border-[#004be3]/30 hover:text-[#004be3]"
              >
                Tham gia ngay
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {categories.map((item, index) => (
              <article
                key={item}
                className={`min-h-72 rounded-[1.65rem] p-4 shadow-[0_20px_50px_rgba(47,47,46,0.12)] lg:min-h-84 lg:p-4.5 ${
                  index === 0
                    ? "bg-[#16161a]"
                    : index === 1
                      ? "bg-[#004be3]"
                      : "bg-[#d97706]"
                }`}
              >
                <div className="flex h-full flex-col justify-between text-white">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/65 lg:text-[11px] lg:tracking-[0.26em]">
                      {index === 0 ? "Feature story" : "Category focus"}
                    </p>
                    <h3
                      className={`mt-3 font-extrabold uppercase tracking-[-0.05em] ${
                        index === 3
                          ? "text-[1.82rem] leading-[0.9] lg:text-[1.95rem]"
                          : "text-[2.05rem] leading-[0.92] lg:text-[2.15rem]"
                      }`}
                    >
                      {item}
                    </h3>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/75 lg:text-xs lg:tracking-[0.22em]">
                      {index === 0
                        ? "34 items available"
                        : index === 1
                          ? "Limited release"
                          : "New season"}
                    </p>
                    <div className="mt-3 h-px w-full bg-white/20" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer
        id="footer"
        className="rounded-t-4xl bg-[#f4f4f5] px-4 py-11 sm:px-6 sm:py-12 lg:px-10 lg:py-16"
      >
        <div className="mx-auto grid w-full max-w-400 gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <p className="font-heading text-2xl font-extrabold uppercase tracking-[-0.04em] text-[#18181b]">
              Vibe Urban
            </p>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#52525b]">
              Thời trang nam theo hướng streetwear hiện đại, tập trung vào cảm
              giác gọn gàng, mạnh mẽ và dễ ứng dụng cho người dùng Việt.
            </p>

            <div className="mt-6 flex items-center gap-4 text-[#52525b]">
              <a
                href="#"
                aria-label="Mail"
                className="transition hover:text-[#004be3]"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Message"
                className="transition hover:text-[#004be3]"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Website"
                className="transition hover:text-[#004be3]"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#18181b]">
              Collections
            </p>
            <div className="mt-5 space-y-3 text-sm text-[#52525b]">
              {footerLinks.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block transition hover:text-[#004be3]"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#18181b]">
              Hỗ trợ
            </p>
            <div className="mt-5 space-y-3 text-sm text-[#52525b]">
              <a href="#" className="block transition hover:text-[#004be3]">
                Câu hỏi thường gặp
              </a>
              <a href="#" className="block transition hover:text-[#004be3]">
                Chính sách đổi trả
              </a>
              <a href="#" className="block transition hover:text-[#004be3]">
                Vận chuyển
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#18181b]">
              Liên hệ
            </p>
            <p className="mt-5 text-sm leading-7 text-[#52525b]">
              support@vibeurban.vn
              <br />
              028 1234 5678
              <br />
              Việt Nam
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
