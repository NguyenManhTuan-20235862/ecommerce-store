import { useAuthStore } from "@/store/authStore";
import { KeyRound, MapPin, Package, UserCircle } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";

/**
 * Profile Layout Component
 * Layout chung cho tất cả profile pages với sidebar navigation
 */
export default function ProfileLayout() {
  const location = useLocation();
  const { user } = useAuthStore();

  const navItems = [
    {
      path: "/profile/info",
      label: "Thông tin tài khoản",
      icon: UserCircle,
    },
    {
      path: "/profile/orders",
      label: "Đơn hàng của tôi",
      icon: Package,
    },
    {
      path: "/profile/addresses",
      label: "Địa chỉ của tôi",
      icon: MapPin,
    },
    {
      path: "/profile/change-password",
      label: "Đổi mật khẩu",
      icon: KeyRound,
    },
  ];

  return (
    <section className="min-h-screen bg-[#f9f6f5] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-extrabold uppercase tracking-[-0.04em] text-[#2f2f2e]">
            Tài khoản
          </h1>
          {user && (
            <p className="mt-2 text-lg text-[#5c5b5b]">
              Xin chào, <span className="font-semibold">{user.displayName}</span>
            </p>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <nav className="space-y-2 rounded-2xl bg-white p-4 shadow-sm">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#004be3] text-white"
                        : "text-[#2f2f2e] hover:bg-[#f3f0ef]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <Outlet />
          </main>
        </div>
      </div>
    </section>
  );
}
