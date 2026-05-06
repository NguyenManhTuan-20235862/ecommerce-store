import {
  AlertTriangle,
  FolderTree,
  Package,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { categoryService } from "../../../services/category.service";
import { orderService } from "../../../services/order.service";
import { productService } from "../../../services/product.service";
import { formatCurrency } from "../../../utils/formatCurrency";

const MONTH_NAMES = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];

function buildMonthlyChart(revenueByMonth) {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1, revenue: 0, orders: 0 });
  }
  for (const r of revenueByMonth) {
    const found = months.find((m) => m.year === r._id.year && m.month === r._id.month);
    if (found) { found.revenue = r.revenue; found.orders = r.orders; }
  }
  return months;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [orderStats, setOrderStats] = useState(null);
  const [productStats, setProductStats] = useState({ totalProducts: 0, totalCategories: 0, featuredProducts: 0 });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, productsRes, categoriesRes, featuredRes] = await Promise.all([
          orderService.getStats(),
          productService.adminList({ limit: 1 }),
          categoryService.list(),
          productService.list({ featured: "true", limit: 1 }),
        ]);
        setOrderStats(statsRes.data.data);
        setProductStats({
          totalProducts: productsRes.data.pagination?.total || 0,
          totalCategories: categoriesRes.data.categories?.length || 0,
          featuredProducts: featuredRes.data.pagination?.total || 0,
        });
      } catch (err) {
        console.error("Lỗi khi tải thống kê:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const mainCards = [
    {
      label: "Tổng đơn hàng",
      value: loading ? "..." : (orderStats?.totalOrders ?? 0),
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
      link: "/admin/orders",
    },
    {
      label: "Doanh thu",
      value: loading ? "..." : formatCurrency(orderStats?.totalRevenue ?? 0),
      icon: Wallet,
      color: "bg-emerald-50 text-emerald-600",
      link: "/admin/orders",
    },
    {
      label: "Chờ xử lý",
      value: loading ? "..." : (orderStats?.ordersByStatus?.pending ?? 0),
      icon: TrendingUp,
      color: "bg-amber-50 text-amber-600",
      link: "/admin/orders",
    },
    {
      label: "Hết hàng",
      value: loading ? "..." : (orderStats?.outOfStock ?? 0),
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
      link: "/admin/products",
    },
  ];

  const secondaryCards = [
    { label: "Sản phẩm", value: productStats.totalProducts, icon: Package, link: "/admin/products" },
    { label: "Danh mục", value: productStats.totalCategories, icon: FolderTree, link: "/admin/categories" },
    { label: "Nổi bật", value: productStats.featuredProducts, icon: TrendingUp, link: "/admin/products" },
  ];

  const STATUS_LABELS = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
  };
  const STATUS_COLORS = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipping: "bg-purple-100 text-purple-700",
    delivered: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const monthlyData = orderStats ? buildMonthlyChart(orderStats.revenueByMonth) : [];
  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">Tổng quan hệ thống quản trị VIBE URBAN</p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Không thể tải dữ liệu thống kê. Kiểm tra kết nối server và thử tải lại trang.
        </div>
      )}

      {/* Stats Cards chính */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mainCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.link}
              className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
                <Icon size={20} />
              </div>
              <p className="mt-4 text-2xl font-bold text-neutral-900">{card.value}</p>
              <p className="mt-1 text-[13px] text-neutral-500">{card.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Doanh thu + Đơn hàng theo trạng thái */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Biểu đồ doanh thu 6 tháng */}
        <div className="col-span-2 rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-neutral-900">Doanh thu 6 tháng gần nhất</h2>
          <p className="text-xs text-neutral-400">(chỉ tính đơn đã giao)</p>
          {loading ? (
            <div className="mt-6 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-8 animate-pulse rounded bg-neutral-100" />
              ))}
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {monthlyData.map((m) => {
                const pct = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={`${m.year}-${m.month}`} className="flex items-center gap-3">
                    <span className="w-6 shrink-0 text-right text-xs text-neutral-400">
                      {MONTH_NAMES[m.month - 1]}
                    </span>
                    <div className="flex-1 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-5 rounded-full bg-[#004BE3] transition-all duration-500"
                        style={{ width: `${pct}%`, minWidth: m.revenue > 0 ? "2px" : "0" }}
                      />
                    </div>
                    <span className="w-28 shrink-0 text-right text-xs text-neutral-600">
                      {m.revenue > 0 ? formatCurrency(m.revenue) : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Đơn hàng theo trạng thái */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-neutral-900">Đơn hàng theo trạng thái</h2>
          {loading ? (
            <div className="mt-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 animate-pulse rounded bg-neutral-100" />
              ))}
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {Object.entries(STATUS_LABELS).map(([status, label]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}>
                    {label}
                  </span>
                  <span className="text-sm font-semibold text-neutral-900">
                    {orderStats?.ordersByStatus?.[status] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top sản phẩm + Thống kê phụ */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Top sản phẩm bán chạy */}
        <div className="col-span-2 rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-neutral-900">Top sản phẩm bán chạy</h2>
          <p className="text-xs text-neutral-400">(không tính đơn đã hủy)</p>
          {loading ? (
            <div className="mt-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-neutral-100" />
              ))}
            </div>
          ) : !orderStats?.topProducts?.length ? (
            <p className="mt-6 text-center text-sm text-neutral-400">Chưa có dữ liệu bán hàng</p>
          ) : (
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-neutral-400">
                  <th className="pb-2 font-medium">#</th>
                  <th className="pb-2 font-medium">Sản phẩm</th>
                  <th className="pb-2 text-right font-medium">Đã bán</th>
                  <th className="pb-2 text-right font-medium">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {(orderStats?.topProducts ?? []).map((p, i) => (
                  <tr key={p._id} className="text-neutral-700">
                    <td className="py-2.5 text-xs text-neutral-400">{i + 1}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-8 w-8 rounded object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded bg-neutral-100" />
                        )}
                        <span className="line-clamp-1 font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-semibold">{p.totalSold}</td>
                    <td className="py-2.5 text-right text-neutral-500">{formatCurrency(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Thống kê phụ + Quick actions */}
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-neutral-900">Catalogue</h2>
            <div className="mt-4 space-y-3">
              {secondaryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.label}
                    to={card.link}
                    className="flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-neutral-50"
                  >
                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                      <Icon size={15} className="text-neutral-400" />
                      {card.label}
                    </div>
                    <span className="text-sm font-semibold text-neutral-900">
                      {loading ? "..." : card.value}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-neutral-900">Thao tác nhanh</h2>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                to="/admin/products/new"
                className="rounded-lg bg-neutral-900 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                + Thêm sản phẩm mới
              </Link>
              <Link
                to="/admin/orders"
                className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-center text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                Xem đơn hàng
              </Link>
              <Link
                to="/admin/coupons"
                className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-center text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                Quản lý coupon
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
