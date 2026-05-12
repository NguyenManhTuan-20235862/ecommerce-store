import { Heart, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../../store/authStore.js";
import { useCartStore } from "../../store/cartStore.js";
import { useWishlistStore } from "../../store/wishlistStore.js";

function formatVnd(price) {
  return new Intl.NumberFormat("vi-VN").format(price);
}

export default function ProductDetails({
  title,
  price,
  description,
  colors,
  sizes,
  defaultSize,
  productId,
  productSlug,
  productImages,
  variants = [],
}) {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addItem = useCartStore((state) => state.addItem);
  const { isWishlisted, toggle } = useWishlistStore();
  const wishlisted = isWishlisted(productId);

  const getVariantStock = (size, colorName) => {
    if (!variants.length) return null;
    const v = variants.find(
      (v) =>
        v.size === size?.toUpperCase() &&
        v.color?.toLowerCase() === colorName?.toLowerCase(),
    );
    return v ? v.stock : 0;
  };

  const isSizeAvailable = (size) => {
    if (!variants.length) return true;
    return variants.some(
      (v) =>
        v.size === size?.toUpperCase() &&
        v.color?.toLowerCase() === selectedColor.name?.toLowerCase() &&
        v.stock > 0,
    );
  };

  const isColorAvailable = (color) => {
    if (!variants.length) return true;
    return variants.some(
      (v) =>
        v.color?.toLowerCase() === color.name?.toLowerCase() &&
        v.size === selectedSize?.toUpperCase() &&
        v.stock > 0,
    );
  };

  const selectedStock = getVariantStock(selectedSize, selectedColor.name);
  const isOutOfStock = variants.length > 0 && selectedStock === 0;

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để thêm vào Wishlist");
      navigate("/login");
      return;
    }
    toggle(productId, { name: title, price, slug: productSlug, images: productImages || [] });
  };

  const handleAddToCart = async () => {
    try {
      if (!user) {
        setError("Vui lòng đăng nhập để thêm vào giỏ hàng");
        return;
      }

      setError(null);
      setSuccessMessage(null);
      setIsLoading(true);

      const result = await addItem(
        { productId, quantity: 1, selectedSize, selectedColor: selectedColor.name },
        1,
      );

      if (result.success) {
        setSuccessMessage("Đã thêm vào giỏ hàng thành công!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(result.message || "Có lỗi xảy ra khi thêm vào giỏ hàng");
      }
    } catch {
      setError("Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="m-0 font-heading text-4xl font-italic leading-10 italic tracking-tight text-[#2f2f2e]">
          {title}
        </h1>

        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-[#004be3]">
            {formatVnd(price)} VND
          </span>
          {selectedStock !== null && (
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                isOutOfStock
                  ? "bg-red-100 text-red-600"
                  : "bg-[#e4e2e1] text-[#2f2f2e]"
              }`}
            >
              {isOutOfStock ? "Hết hàng" : `${selectedStock} in stock`}
            </span>
          )}
        </div>
      </div>

      <p className="text-base leading-relaxed text-[#5c5b5b]">{description}</p>

      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-widest text-[#5c5b5b]">
          Color: {selectedColor.name}
        </label>
        <div className="flex gap-4">
          {colors.map((color) => {
            const available = isColorAvailable(color);
            return (
              <button
                key={color.name}
                onClick={() => available && setSelectedColor(color)}
                className={`relative h-10 w-10 rounded-full transition ${
                  selectedColor.name === color.name
                    ? "ring-2 ring-offset-2 ring-[#004be3]"
                    : ""
                } ${!available ? "opacity-40 cursor-not-allowed" : "hover:opacity-90"}`}
                style={{ backgroundColor: color.hex }}
                title={available ? color.name : `${color.name} — Hết hàng`}
              >
                {!available && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden">
                    <span className="block h-px w-10 rotate-45 bg-white/80" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-widest text-[#5c5b5b]">
            Select Size
          </label>
          <button className="text-xs font-bold uppercase tracking-widest text-[#004be3] underline">
            Size Guide
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {sizes.map((size) => {
            const available = isSizeAvailable(size);
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => available && setSelectedSize(size)}
                title={available ? size : `${size} — Hết hàng`}
                className={`rounded-lg py-3 text-center font-bold transition ${
                  isSelected && available
                    ? "bg-[#004be3] text-white"
                    : available
                      ? "bg-[#e4e2e1] text-[#2f2f2e] hover:bg-[#dfdcdc]"
                      : "bg-[#e4e2e1] text-[#94a3b8] line-through cursor-not-allowed"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={isLoading || isOutOfStock}
          className="w-full rounded-full bg-gradient-to-r from-[#004be3] to-[#819bff] py-4 font-heading text-lg font-bold uppercase tracking-wide text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Đang thêm..." : isOutOfStock ? "Hết hàng" : "Add to Pulse"}
        </button>

        <button
          onClick={handleWishlist}
          className={`w-full flex items-center justify-center gap-3 rounded-full py-4 font-heading text-base font-bold uppercase tracking-wide transition ${
            wishlisted
              ? "bg-red-50 text-red-500 hover:bg-red-100"
              : "bg-[#dfdcdc] text-[#2f2f2e] hover:bg-[#d4d1d1]"
          }`}
        >
          <Heart className={`h-5 w-5 ${wishlisted ? "fill-red-500" : ""}`} />
          {wishlisted ? "Đã lưu" : "Add to Wishlist"}
        </button>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}
      </div>

      <div className="border-t border-black/10 pt-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-[#2f2f2e]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#2f2f2e]">
              Express Delivery
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-[#2f2f2e]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#2f2f2e]">
              Auth Guaranteed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
