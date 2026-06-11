import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { buttonTap, cardHover } from "../../../animations/variants";
import { useAuthStore } from "../../../store/authStore";
import { useCartStore } from "../../../store/cartStore";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function ProductCard({
  _id,
  slug,
  title,
  category,
  price,
  compareAtPrice = 0,
  badge,
  tone,
  image,
  variants = [],
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addItem = useCartStore((state) => state.addItem);

  const isRealProduct = Boolean(_id && slug);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!isRealProduct) {
      toast.error("Sản phẩm không khả dụng");
      return;
    }

    const firstVariant = variants.find((v) => v.stock > 0);
    if (!firstVariant) {
      navigate(`/product/${slug}`);
      return;
    }

    const result = await addItem(
      {
        productId: _id,
        selectedSize: firstVariant.size,
        selectedColor: firstVariant.color,
      },
      1,
    );

    if (result?.success) {
      toast.success(`Đã thêm ${title} vào giỏ hàng`);
    } else {
      toast.error(result?.message || "Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  const card = (
    <motion.article
      {...cardHover}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-[#f9f6f5] shadow-[0_20px_50px_rgba(47,47,46,0.08)] hover:shadow-[0_30px_70px_rgba(47,47,46,0.12)]"
    >
      <div
        className={`relative aspect-4/3 overflow-hidden bg-linear-to-br ${tone || "from-[#1a1a1e] via-[#21212a] to-[#2f2f2e]"}`}
      >
        {image && (
          <img
            src={image}
            alt={title}
            onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400/e4e2e1/5c5b5b?text=No+Image"; }}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.55)_100%)]" />
        <div className="absolute left-4 top-4 rounded-full bg-[#004be3] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
          {badge}
        </div>
        {/* Frosted glass panel — chứa tên sản phẩm */}
        <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">
            {category}
          </p>
          <h3 className="line-clamp-2 text-[0.9rem] font-bold leading-snug tracking-[-0.02em] text-white">
            {title}
          </h3>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 p-4">
        <div className="flex flex-col leading-tight">
          <span className={`price line-through text-[#5c5b5b]/60 ${!compareAtPrice || compareAtPrice <= price ? "invisible" : ""}`}>
            {typeof compareAtPrice === "number" ? formatCurrency(compareAtPrice) : compareAtPrice}
          </span>
          <span className="price text-[#004be3]">
            {typeof price === "number" ? formatCurrency(price) : price}
          </span>
        </div>
        <motion.button
          type="button"
          onClick={handleAddToCart}
          {...buttonTap}
          className="inline-flex items-center justify-center rounded-full bg-[#004be3] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:brightness-110"
        >
          Thêm vào giỏ
        </motion.button>
      </div>
    </motion.article>
  );

  if (isRealProduct) {
    return (
      <Link to={`/product/${slug}`} className="block">
        {card}
      </Link>
    );
  }

  return card;
}
