import { Heart, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../../../store/authStore";
import { useCartStore } from "../../../store/cartStore";
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
  const addItem = useCartStore((state) => state.addItem);
  const { isWishlisted, toggle } = useWishlistStore();
  const wishlisted = isWishlisted(product._id);
  const [isAdding, setIsAdding] = useState(false);
  const isLarge = className.includes("col-span-2");

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để thêm vào giỏ hàng");
      navigate("/login");
      return;
    }

    if (product.isOutOfStock || isAdding) return;

    setIsAdding(true);
    try {
      const result = await addItem(
        {
          productId: product._id,
          selectedSize: product.defaultVariant?.size,
          selectedColor: product.defaultVariant?.color,
        },
        1,
      );

      if (result?.success) {
        toast.success("Đã thêm vào giỏ hàng");
      } else {
        toast.error(result?.message || "Có lỗi xảy ra khi thêm vào giỏ hàng");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = (e) => {
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

        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handleWishlist}
            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-md transition hover:scale-110 ${
              wishlisted
                ? "bg-red-500 text-white"
                : "bg-white text-[#0f172a] hover:text-red-500"
            }`}
            aria-label={wishlisted ? "Xóa khỏi Wishlist" : "Thêm vào Wishlist"}
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={product.isOutOfStock || isAdding}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#004be3] text-white shadow-md transition hover:scale-110 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            aria-label="Thêm nhanh vào giỏ hàng"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
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
