import { Heart, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../../../store/authStore";
import { useCartStore } from "../../../store/cartStore";
import { useWishlistStore } from "../../../store/wishlistStore";
import { formatCurrency } from "../../../utils/formatCurrency";
import { resolveColorHex } from "../../../utils/colorMap";

const badgeToneClasses = {
  brand: "bg-[#004be3] text-white",
  rust: "bg-[#a33800] text-white",
  ink: "bg-[#2f2f2e] text-white",
  green: "bg-[#006a26] text-white",
};

export default function ProductTile({ product, className = "" }) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addItem = useCartStore((state) => state.addItem);
  const { isWishlisted, toggle } = useWishlistStore();
  const wishlisted = isWishlisted(product._id);
  const isLarge = className.includes("col-span-2");

  const [showSizePicker, setShowSizePicker] = useState(false);
  const [addingSize, setAddingSize] = useState(null);

  // Danh sách màu duy nhất còn hàng
  const availableColors = useMemo(() => [...new Set(
    (product.variants ?? [])
      .filter((v) => v.stock > 0)
      .map((v) => v.color)
      .filter(Boolean)
  )], [product.variants]);

  const [selectedColor, setSelectedColor] = useState(() => availableColors[0] ?? "");

  // Size còn hàng theo màu đang chọn
  const availableSizes = useMemo(() => [...new Set(
    (product.variants ?? [])
      .filter((v) => v.stock > 0 && (!selectedColor || v.color === selectedColor))
      .map((v) => v.size)
  )], [product.variants, selectedColor]);

  const handlePlusClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để thêm vào giỏ hàng");
      navigate("/login");
      return;
    }
    if (product.isOutOfStock) return;
    setShowSizePicker(true);
  };

  const handleSizeSelect = async (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    if (addingSize) return;

    setAddingSize(size);
    try {
      const result = await addItem(
        {
          productId: product._id,
          selectedSize: size,
          selectedColor: selectedColor || product.defaultVariant?.color || "",
        },
        1,
      );

      if (result?.success) {
        toast.success(`Đã thêm ${product.title} (${size}) vào giỏ hàng`);
        setShowSizePicker(false);
      } else {
        toast.error(result?.message || "Có lỗi xảy ra");
      }
    } finally {
      setAddingSize(null);
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

  const handleClosePicker = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSizePicker(false);
  };

  const hasComparePrice = product.compareAtPrice > product.price;

  return (
    <Link
      to={`/product/${product.id}`}
      className={`group flex flex-col gap-3 transition hover:no-underline ${className}`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl bg-[#f3f0ef] ${isLarge ? "aspect-[4/3] md:aspect-[2/1]" : "aspect-square"}`}
      >
        <img
          src={product.image || "https://placehold.co/800x800/e4e2e1/5c5b5b?text=No+Image"}
          alt={product.title}
          onError={(e) => { e.currentTarget.src = "https://placehold.co/800x800/e4e2e1/5c5b5b?text=No+Image"; }}
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
            <span className="rounded-full bg-[#f9f6f5] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#2f2f2e]">
              Hết hàng
            </span>
          </div>
        )}

        {/* Size picker overlay */}
        {showSizePicker && (
          <div
            className="absolute inset-0 flex flex-col justify-end rounded-2xl bg-gradient-to-t from-white/95 to-white/70 backdrop-blur-sm p-4"
            onClick={handleClosePicker}
          >
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-[#2f2f2e]">
              Thêm nhanh vào giỏ hàng <Plus className="inline h-3 w-3" />
            </p>
            <div
              className="grid grid-cols-3 gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {availableSizes.length > 0 ? availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={(e) => handleSizeSelect(e, size)}
                  disabled={addingSize === size}
                  className="rounded-xl border border-[#dfdcdc] bg-white py-2 text-sm font-semibold text-[#2f2f2e] transition hover:border-[#004be3] hover:bg-[#004be3] hover:text-white disabled:opacity-50"
                >
                  {addingSize === size ? "..." : size}
                </button>
              )) : (
                <p className="col-span-3 text-center text-xs text-[#5c5b5b]">Hết tất cả size</p>
              )}
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handleWishlist}
            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-md transition hover:scale-110 ${
              wishlisted
                ? "bg-red-500 text-white"
                : "bg-[#f9f6f5] text-[#2f2f2e] hover:text-red-500"
            }`}
            aria-label={wishlisted ? "Xóa khỏi Wishlist" : "Thêm vào Wishlist"}
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
          </button>

          <button
            type="button"
            onClick={showSizePicker ? handleClosePicker : handlePlusClick}
            disabled={product.isOutOfStock}
            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-md transition hover:scale-110 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 ${
              showSizePicker ? "bg-[#2f2f2e] text-white" : "bg-[#004be3] text-white"
            }`}
            aria-label="Thêm nhanh vào giỏ hàng"
          >
            <Plus className={`h-4 w-4 transition-transform duration-200 ${showSizePicker ? "rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Color swatches */}
      {availableColors.length > 0 && (
        <div className="flex items-center gap-1.5 px-1" onClick={(e) => e.preventDefault()}>
          {availableColors.map((color) => {
            const hex = resolveColorHex(color);
            const isSelected = selectedColor === color;
            const isLight = ["#f5f5f5", "#faf7f2", "#e8e8e8", "#d1d5db", "#fef9ee", "#fbcfe8"].includes(hex);
            return (
              <button
                key={color}
                type="button"
                title={color}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedColor(color);
                  setShowSizePicker(false);
                }}
                className={`h-5 w-5 rounded-full transition-all duration-150 ${
                  isSelected
                    ? "ring-2 ring-[#004be3] ring-offset-1 scale-110"
                    : "hover:scale-110"
                } ${isLight ? "border border-[#dfdcdc]" : ""}`}
                style={{ backgroundColor: hex }}
              />
            );
          })}
        </div>
      )}

      <div className="flex items-end justify-between gap-4 px-1">
        <h3 className="m-0 font-heading text-lg font-bold uppercase leading-tight text-[#2f2f2e]">
          {product.title}
        </h3>
        <div className="flex flex-col items-end whitespace-nowrap">
          {hasComparePrice && (
            <span className="text-xs text-[#5c5b5b] line-through">
              {formatCurrency(product.compareAtPrice)}
            </span>
          )}
          <span className="price text-[#004be3]">
            {formatCurrency(product.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
