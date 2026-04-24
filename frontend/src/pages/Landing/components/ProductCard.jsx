import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../../../store/authStore";
import { useCartStore } from "../../../store/cartStore";

export default function ProductCard({ title, category, price, badge, tone }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập/đăng ký để thêm sản phẩm vào giỏ hàng");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const result = await addItem({
      productId: title.toLowerCase().replace(/\s+/g, "-"),
      selectedSize: "M",
      selectedColor: "Urban Core",
    }, 1);

    if (result && result.success) {
      toast.success(`Đã thêm ${title} vào giỏ hàng`);
    } else {
      toast.error(result?.message || "Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_20px_50px_rgba(47,47,46,0.08)] transition duration-300 hover:-translate-y-px hover:shadow-[0_30px_70px_rgba(47,47,46,0.12)]">
      <div
        className={`relative aspect-4/3 overflow-hidden bg-linear-to-br ${tone}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.38),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(129,155,255,0.28),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.12),rgba(0,0,0,0.1))]" />
        <div className="absolute left-4 top-4 rounded-full bg-[#004be3] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
          {badge}
        </div>
        <div className="absolute inset-x-6 bottom-6 h-20 rounded-[1.25rem] border border-white/20 bg-white/10 backdrop-blur-sm" />
      </div>

      <div className="space-y-2 p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#71717a]">
          {category}
        </p>
        <div className="flex items-end justify-between gap-4">
          <h3 className="text-[1.05rem] font-bold tracking-[-0.03em] text-[#2f2f2e]">
            {title}
          </h3>
          <span className="text-lg font-extrabold tracking-[-0.04em] text-[#004be3]">
            {price}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-3 inline-flex items-center justify-center rounded-full bg-[#004be3] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#003cc0]"
        >
          Thêm vào giỏ
        </button>
      </div>
    </article>
  );
}
