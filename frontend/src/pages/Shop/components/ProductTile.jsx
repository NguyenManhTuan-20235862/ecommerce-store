import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

const badgeToneClasses = {
  brand: "bg-[#004be3] text-white",
  rust: "bg-[#a33800] text-white",
  ink: "bg-[#0f172a] text-white",
  green: "bg-[#006a26] text-white",
};

function formatVnd(price) {
  return `${new Intl.NumberFormat("vi-VN").format(price)} VND`;
}

export default function ProductTile({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col gap-5 transition hover:no-underline"
    >
      <div className="relative overflow-hidden rounded-3xl bg-[#f3f0ef]">
        <img
          src={product.image}
          alt={product.title}
          className="h-65 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {product.badge ? (
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
              badgeToneClasses[product.badge.tone] || badgeToneClasses.brand
            }`}
          >
            {product.badge.text}
          </span>
        ) : null}

        <div
          className="absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0f172a] opacity-0 shadow-lg transition group-hover:opacity-100"
          aria-label={`Xem nhanh ${product.title}`}
        >
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
          {product.categoryLabel}
        </p>
        <h3 className="m-0 font-heading text-xl font-bold leading-7 text-[#0f172a]">
          {product.title}
        </h3>
        <p className="text-3xl font-bold leading-7 text-[#004be3]">
          {formatVnd(product.price)}
        </p>
      </div>
    </Link>
  );
}
