import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";

const productMenu = [
  { label: "Tất cả sản phẩm", to: "/shop" },
  { label: "Áo", to: "/shop?category=tops" },
  { label: "Quần", to: "/shop?category=bottoms" },
  { label: "Giày", to: "/shop?category=sneakers" },
  { label: "Phụ kiện", to: "/shop?category=accessories" },
];

const collectionMenu = [
  { label: "Hàng mới về", to: "/shop?collection=new" },
  { label: "Bán chạy", to: "/shop?collection=best-seller" },
  { label: "Urban Essentials", to: "/shop?collection=essentials" },
  { label: "Theo mùa", to: "/shop?collection=seasonal" },
];

const supportMenu = [
  { label: "FAQ", to: "/" },
  { label: "Giao hàng và đổi trả", to: "/" },
  { label: "Liên hệ", to: "/" },
];

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const accountLink =
    isAuthenticated && user?.role === "admin" ? "/admin" : "/profile";

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="rounded-full p-2 text-[#2f2f2e] transition hover:bg-[#f3f0ef] md:hidden"
          aria-label="Mở menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>

        <Link
          to="/"
          className="text-sm font-extrabold uppercase tracking-tight text-[#004be3]"
        >
          VIBE URBAN
        </Link>

        <nav className="hidden items-center gap-5 text-[11px] font-semibold uppercase tracking-wide text-[#5c5b5b] md:flex">
          <Link to="/" className="transition hover:text-[#004be3]">
            Trang chủ
          </Link>

          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 transition hover:text-[#004be3]"
            >
              Sản phẩm <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="invisible absolute left-0 top-full z-20 mt-3 w-52 rounded-xl border border-black/5 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
              {productMenu.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="block rounded-lg px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-[#5c5b5b] hover:bg-[#f3f0ef] hover:text-[#004be3]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 transition hover:text-[#004be3]"
            >
              Bộ sưu tập <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="invisible absolute left-0 top-full z-20 mt-3 w-52 rounded-xl border border-black/5 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
              {collectionMenu.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="block rounded-lg px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-[#5c5b5b] hover:bg-[#f3f0ef] hover:text-[#004be3]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/shop?collection=new"
            className="transition hover:text-[#004be3]"
          >
            New Drops
          </Link>
          <Link
            to="/shop?sale=true"
            className="transition hover:text-[#004be3]"
          >
            Khuyến mãi
          </Link>
          <Link to="/" className="transition hover:text-[#004be3]">
            Về thương hiệu
          </Link>

          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 transition hover:text-[#004be3]"
            >
              Hỗ trợ <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="invisible absolute right-0 top-full z-20 mt-3 w-52 rounded-xl border border-black/5 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
              {supportMenu.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="block rounded-lg px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-[#5c5b5b] hover:bg-[#f3f0ef] hover:text-[#004be3]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-1 text-[#2f2f2e] sm:gap-2">
          <button
            type="button"
            className="rounded-full p-2 transition hover:bg-[#f3f0ef]"
            aria-label="Tìm kiếm"
          >
            <Search strokeWidth={1.9} className="h-4 w-4" />
          </button>

          <Link
            to={isAuthenticated ? "/profile" : "/login"}
            className="rounded-full p-2 transition hover:bg-[#f3f0ef]"
            aria-label="Yêu thích"
          >
            <Heart strokeWidth={1.9} className="h-4 w-4" />
          </Link>

          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setIsAccountMenuOpen((prev) => !prev)}
              className="rounded-full p-2 transition hover:bg-[#f3f0ef]"
              aria-label="Tài khoản"
            >
              <User strokeWidth={1.9} className="h-4 w-4" />
            </button>

            {isAccountMenuOpen && (
              <div className="absolute right-0 top-full z-20 mt-3 w-48 rounded-xl border border-black/5 bg-white p-2 shadow-lg">
                {!isAuthenticated && (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-[#5c5b5b] hover:bg-[#f3f0ef] hover:text-[#004be3]"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-[#5c5b5b] hover:bg-[#f3f0ef] hover:text-[#004be3]"
                    >
                      Đăng ký
                    </Link>
                  </>
                )}

                {isAuthenticated && (
                  <>
                    <Link
                      to={accountLink}
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-[#5c5b5b] hover:bg-[#f3f0ef] hover:text-[#004be3]"
                    >
                      Tài khoản
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-[#5c5b5b] hover:bg-[#f3f0ef] hover:text-[#004be3]"
                    >
                      Đơn hàng của tôi
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-[#5c5b5b] hover:bg-[#f3f0ef] hover:text-[#004be3]"
                      >
                        Quản trị
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={async () => {
                        setIsAccountMenuOpen(false);
                        const success = await logout();
                        if (success) {
                          navigate("/login", { replace: true });
                        }
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-[#b23a3a] hover:bg-[#fdf1f1]"
                    >
                      Đăng xuất
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <Link
            to={isAuthenticated ? accountLink : "/login"}
            className="rounded-full p-2 transition hover:bg-[#f3f0ef] sm:hidden"
            aria-label="Tài khoản"
          >
            <User strokeWidth={1.9} className="h-4 w-4" />
          </Link>

          <Link
            to="/cart"
            className="relative rounded-full p-2 transition hover:bg-[#f3f0ef]"
            aria-label="Giỏ hàng"
          >
            <ShoppingBag strokeWidth={1.9} className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#004be3] px-1 text-[9px] font-bold text-white">
              0
            </span>
          </Link>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-black/5 bg-white px-4 py-4 md:hidden">
          <nav className="space-y-2 text-[12px] font-semibold uppercase tracking-wide text-[#5c5b5b]">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 hover:bg-[#f3f0ef] hover:text-[#004be3]"
            >
              Trang chủ
            </Link>
            <details>
              <summary className="cursor-pointer rounded-lg px-3 py-2 hover:bg-[#f3f0ef]">
                Sản phẩm
              </summary>
              <div className="mt-1 space-y-1 pl-3">
                {productMenu.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-[11px] hover:bg-[#f3f0ef] hover:text-[#004be3]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
            <details>
              <summary className="cursor-pointer rounded-lg px-3 py-2 hover:bg-[#f3f0ef]">
                Bộ sưu tập
              </summary>
              <div className="mt-1 space-y-1 pl-3">
                {collectionMenu.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-[11px] hover:bg-[#f3f0ef] hover:text-[#004be3]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
            <Link
              to="/shop?collection=new"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 hover:bg-[#f3f0ef] hover:text-[#004be3]"
            >
              New Drops
            </Link>
            <Link
              to="/shop?sale=true"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 hover:bg-[#f3f0ef] hover:text-[#004be3]"
            >
              Khuyến mãi
            </Link>
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 hover:bg-[#f3f0ef] hover:text-[#004be3]"
            >
              Về thương hiệu
            </Link>
            <details>
              <summary className="cursor-pointer rounded-lg px-3 py-2 hover:bg-[#f3f0ef]">
                Hỗ trợ
              </summary>
              <div className="mt-1 space-y-1 pl-3">
                {supportMenu.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-[11px] hover:bg-[#f3f0ef] hover:text-[#004be3]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
          </nav>

          <div className="mt-3 border-t border-black/5 pt-3">
            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-full border border-black/10 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#5c5b5b]"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-full bg-[#004be3] px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-white"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <div className="space-y-2">
                <Link
                  to={accountLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#5c5b5b] hover:bg-[#f3f0ef] hover:text-[#004be3]"
                >
                  Tài khoản
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-[#b23a3a] hover:bg-[#fdf1f1]"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
