import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

function formatVndLines(price) {
  const value = new Intl.NumberFormat("vi-VN").format(price);
  return [value, "VND"];
}

export default function FeaturedProductTile({ product }) {
  const [priceLineOne, priceLineTwo] = formatVndLines(product.price);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col gap-5 lg:col-span-2 transition hover:no-underline"
    >
      <div className="relative overflow-hidden rounded-3xl bg-[#f3f0ef]">
        <img
          src={product.image}
          alt={product.title}
          className="h-65 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-5 top-5 max-w-52 space-y-3">
          <span className="inline-block rounded-full bg-[#004be3] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
            {product.featured?.pill}
          </span>
          <div className="rounded-2xl bg-white/85 p-4 backdrop-blur">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#004be3]">
              {product.featured?.lead}
            </p>
            <p className="mt-1 text-sm leading-5 text-[#334155]">
              {product.featured?.text}
            </p>
          </div>
        </div>

        <div className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-[#004be3] px-7 py-3 text-xs font-extrabold uppercase tracking-widest text-white shadow-lg transition group-hover:brightness-110">
          {product.featured?.cta}
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
            {product.categoryLabel}
          </p>
          <h3 className="m-0 font-heading text-2xl font-extrabold italic uppercase tracking-tight text-[#0f172a]">
            {product.title}
          </h3>
        </div>

        <p className="text-right text-3xl font-bold uppercase leading-8 text-[#004be3]">
          <span className="block">{priceLineOne}</span>
          <span className="block">{priceLineTwo}</span>
        </p>
      </div>
    </Link>
  );
}
