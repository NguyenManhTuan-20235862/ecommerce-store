import { Heart, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore.js";
import { useCartStore } from "../../store/cartStore.js";

function formatVnd(price) {
  return new Intl.NumberFormat("vi-VN").format(price);
}

export default function ProductDetails({
  title,
  price,
  stock,
  description,
  colors,
  sizes,
  defaultSize,
  productId,
}) {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const user = useAuthStore((state) => state.user);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async () => {
    try {
      // Kiểm tra xem user đã đăng nhập chưa
      if (!user) {
        setError("Vui lòng đăng nhập để thêm vào giỏ hàng");
        return;
      }

      setError(null);
      setSuccessMessage(null);
      setIsLoading(true);

      const cartData = {
        productId,
        quantity: 1,
        selectedSize,
        selectedColor: selectedColor.name,
      };

      const result = await addItem(cartData, 1);

      if (result.success) {
        setSuccessMessage("Đã thêm vào giỏ hàng thành công!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(result.message || "Có lỗi xảy ra khi thêm vào giỏ hàng");
      }
    } catch (err) {
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
          <span className="inline-block rounded-full bg-[#e4e2e1] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#2f2f2e]">
            {stock}
          </span>
        </div>
      </div>

      <p className="text-base leading-relaxed text-[#5c5b5b]">{description}</p>

      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-widest text-[#5c5b5b]">
          Color: {selectedColor.name}
        </label>
        <div className="flex gap-4">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color)}
              className={`h-10 w-10 rounded-full transition ${
                selectedColor.name === color.name
                  ? "ring-2 ring-offset-2 ring-[#004be3]"
                  : ""
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
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
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`rounded-lg py-3 text-center font-bold transition ${
                selectedSize === size
                  ? "bg-[#004be3] text-white"
                  : "bg-[#e4e2e1] text-[#2f2f2e] hover:bg-[#dfdcdc]"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full rounded-full bg-gradient-to-r from-[#004be3] to-[#819bff] py-4 font-heading text-lg font-bold uppercase tracking-wide text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Đang thêm..." : "Add to Pulse"}
        </button>

        <button className="w-full flex items-center justify-center gap-3 rounded-full bg-[#dfdcdc] py-4 font-heading text-base font-bold uppercase tracking-wide text-[#2f2f2e] transition hover:bg-[#d4d1d1]">
          <Heart className="h-5 w-5" />
          Add to Wishlist
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
