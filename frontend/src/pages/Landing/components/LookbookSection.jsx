import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

export default function LookbookSection({ categories, isAuthenticated }) {
  return (
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
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-[#2f2f2e] transition hover:border-[#004be3]/30 hover:text-[#004be3]"
              >
                Tài khoản
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-[#2f2f2e] transition hover:border-[#004be3]/30 hover:text-[#004be3]"
              >
                Tham gia ngay
              </Link>
            )}
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
  );
}
