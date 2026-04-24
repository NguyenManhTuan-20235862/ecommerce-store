import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

export default function SectionNavBar({ isAuthenticated, sectionNavItems }) {
  return (
    <section className="px-4 pb-0 pt-4 sm:px-6 lg:px-10 lg:pt-6">
      <div className="mx-auto w-full max-w-400">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-4xl border border-black/10 bg-[#f4f4f5] px-5 py-3 shadow-[0_10px_30px_rgba(47,47,46,0.08)] sm:flex-nowrap sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#004be3] text-sm font-extrabold uppercase text-white">
              VU
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold uppercase tracking-[0.24em] text-[#2f2f2e]">
                VIBE URBAN
              </p>
              <p className="truncate text-sm text-[#5c5b5b]">
                Trang phục nam hiện đại
              </p>
            </div>
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-10 text-sm font-semibold text-[#5c5b5b] lg:flex">
            {sectionNavItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="transition hover:text-[#004be3]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-6 text-base font-semibold text-[#2f2f2e] transition hover:border-[#004be3]/35 hover:text-[#004be3]"
              >
                Đăng nhập
              </Link>
            ) : null}
            <Link
              to="/shop"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#004be3] px-6 text-base font-semibold text-white transition hover:bg-[#003cc0]"
            >
              Khám phá
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
