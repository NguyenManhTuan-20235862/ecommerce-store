import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import ProductCard from "./ProductCard";

export default function DropsSection({ drops }) {
  return (
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
  );
}
