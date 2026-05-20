import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../../../store/authStore";
import { useWishlistStore } from "../../../store/wishlistStore";

const badgeToneClasses = {
  brand: "bg-[#004be3] text-white",
  rust: "bg-[#a33800] text-white",
  ink: "bg-[#0f172a] text-white",
  green: "bg-[#006a26] text-white",
};

function formatVnd(price) {
  return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
}

export default function ProductTile({ product, className = "" }) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { isWishlisted, toggle } = useWishlistStore();
  const wishlisted = isWishlisted(product._id);
  const isLarge = className.includes("col-span-2");

  const handleQuickAction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để thêm vào Wishlist");
      navigate("/login");
      return;
    }
    toggle(product._id, {
      name: product.title,
      slug: product.id,
      price: product.price,
      images: [product.image],
    });
    if (!wishlisted) {
      toast.success("Đã thêm vào Wishlist");
    } else {
      toast.success("Đã xóa khỏi Wishlist");
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className={`group flex flex-col gap-3 transition hover:no-underline ${className}`}
    >
      <div 
        className={`relative overflow-hidden rounded-2xl bg-[#f3f0ef] ${isLarge ? "aspect-[4/3] md:aspect-[2/1]" : "aspect-square"}`}
      >
        <img
          src={product.image || "https://placehold.co/800x800/f3f0ef/94a3b8?text=No+Image"}
          alt={product.title}
          onError={(e) => { e.currentTarget.src = "https://placehold.co/800x800/f3f0ef/94a3b8?text=No+Image"; }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
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

        {product.isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
            <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0f172a]">
              Hết hàng
            </span>
          </div>
        )}

        <button
          onClick={handleQuickAction}
          className={`absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full transition shadow-md hover:scale-110 ${
            wishlisted ? "bg-red-500 text-white" : "bg-[#004be3] text-white hover:bg-blue-700"
          }`}
          aria-label={wishlisted ? "Xóa khỏi Wishlist" : "Thêm vào Wishlist"}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-end justify-between gap-4 px-1">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
            {product.categoryLabel}
          </p>
          <h3 className="mt-1 m-0 font-heading text-lg font-bold uppercase leading-tight text-[#0f172a]">
            {product.title}
          </h3>
        </div>
        <p className="whitespace-nowrap text-lg font-bold text-[#004be3]">
          {formatVnd(product.price)}
        </p>
      </div>
    </Link>
  );
}
