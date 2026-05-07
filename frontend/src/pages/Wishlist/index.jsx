import { Heart, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../store/authStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { getImageUrl } from "../../utils/getImageUrl";
import { formatCurrency } from "../../utils/formatCurrency";

export default function Wishlist() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrating = useAuthStore((s) => s.isHydrating);
  const { items, isLoading, toggle } = useWishlistStore();

  useEffect(() => {
    if (!isHydrating && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, isHydrating, navigate]);

  if (isHydrating || isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10">
          <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square animate-pulse rounded-2xl bg-neutral-200" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-[#f9f6f5]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#004be3]">
              Của bạn
            </p>
            <h1 className="m-0 font-heading text-4xl font-extrabold uppercase tracking-tight text-[#0f172a]">
              Wishlist
            </h1>
          </div>
          {items.length > 0 && (
            <span className="text-sm text-neutral-500">{items.length} sản phẩm</span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
              <Heart className="h-10 w-10 text-neutral-300" />
            </div>
            <div>
              <p className="text-lg font-semibold text-neutral-700">Chưa có sản phẩm yêu thích</p>
              <p className="mt-1 text-sm text-neutral-400">Thêm sản phẩm vào Wishlist khi duyệt cửa hàng</p>
            </div>
            <Link
              to="/shop"
              className="rounded-full bg-[#004be3] px-8 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:brightness-110"
            >
              Khám phá Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div key={String(item._id)} className="group relative flex flex-col gap-3">
                <div className="relative overflow-hidden rounded-2xl bg-[#f3f0ef]">
                  <Link to={`/product/${item.slug}`}>
                    <img
                      src={getImageUrl(item.images?.[0] || "") || "https://placehold.co/400x400/f3f0ef/94a3b8?text=No+Image"}
                      alt={item.name}
                      onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400/f3f0ef/94a3b8?text=No+Image"; }}
                      className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <button
                    onClick={() => toggle(String(item._id))}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
                    aria-label="Xóa khỏi Wishlist"
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </button>
                </div>

                <div className="space-y-1 px-1">
                  <Link
                    to={`/product/${item.slug}`}
                    className="line-clamp-1 text-sm font-bold text-[#0f172a] hover:text-[#004be3]"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm font-bold text-[#004be3]">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                <Link
                  to={`/product/${item.slug}`}
                  className="flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white py-2 text-xs font-bold uppercase tracking-widest text-neutral-700 transition hover:border-[#004be3] hover:text-[#004be3]"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Xem sản phẩm
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
