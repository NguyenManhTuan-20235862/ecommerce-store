import { AlertTriangle, FolderTree, Package, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { categoryService } from "../../../services/category.service";
import { productService } from "../../../services/product.service";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    outOfStock: 0,
    featuredProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, categoriesRes, featuredRes] = await Promise.all([
          productService.adminList({ limit: 1 }),
          categoryService.list(),
          productService.list({ featured: "true", limit: 1 }),
        ]);

        setStats({
          totalProducts: productsRes.data.pagination?.total || 0,
          totalCategories: categoriesRes.data.categories?.length || 0,
          outOfStock: 0, // Sẽ tính sau khi có đầy đủ dữ liệu
          featuredProducts: featuredRes.data.pagination?.total || 0,
        });
      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      label: "Tổng sản phẩm",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      link: "/admin/products",
    },
    {
      label: "Danh mục",
      value: stats.totalCategories,
      icon: FolderTree,
      color: "bg-emerald-50 text-emerald-600",
      link: "/admin/categories",
    },
    {
      label: "Sản phẩm nổi bật",
      value: stats.featuredProducts,
      icon: TrendingUp,
      color: "bg-amber-50 text-amber-600",
      link: "/admin/products",
    },
    {
      label: "Hết hàng",
      value: stats.outOfStock,
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
      link: "/admin/products",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Tổng quan hệ thống quản trị VIBE URBAN
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.link}
              className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}
                >
                  <Icon size={20} />
                </div>
              </div>
              <p className="mt-4 text-2xl font-bold text-neutral-900">
                {loading ? "..." : card.value}
              </p>
              <p className="mt-1 text-[13px] text-neutral-500">{card.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="text-base font-semibold text-neutral-900">
          Thao tác nhanh
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/admin/products/new"
            className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            + Thêm sản phẩm mới
          </Link>
          <Link
            to="/admin/categories"
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            Quản lý danh mục
          </Link>
          <Link
            to="/admin/orders"
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            Xem đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
