import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Ticket,
  LogOut,
  Home,
  ChevronRight,
} from "lucide-react";

const MENU = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Sản phẩm", icon: Package },
  { to: "/admin/categories", label: "Danh mục", icon: FolderTree },
  { to: "/admin/orders", label: "Đơn hàng", icon: ShoppingCart },
  { to: "/admin/customers", label: "Khách hàng", icon: Users },
  { to: "/admin/coupons", label: "Mã giảm giá", icon: Ticket },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Kiểm tra menu đang active
  const isActive = (item) => {
    if (item.end) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col border-r border-neutral-200 bg-white">
        {/* Logo / Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-neutral-200 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-xs font-black text-white">
            VU
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-neutral-900">
              VIBE URBAN
            </p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-neutral-400">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {MENU.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all ${
                  active
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.2 : 1.8}
                  className={active ? "text-white" : "text-neutral-400 group-hover:text-neutral-600"}
                />
                <span className="flex-1">{item.label}</span>
                {active && (
                  <ChevronRight size={14} className="text-neutral-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer: User info + Actions */}
        <div className="border-t border-neutral-200 p-4">
          <Link
            to="/"
            className="mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <Home size={16} />
            Về trang chủ
          </Link>

          <div className="flex items-center gap-3 rounded-lg bg-neutral-50 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
              {user?.displayName?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-[13px] font-semibold text-neutral-800">
                {user?.displayName || "Admin"}
              </p>
              <p className="text-[11px] text-neutral-400">Quản trị viên</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-200 hover:text-red-600"
              title="Đăng xuất"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[260px] flex-1 p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
