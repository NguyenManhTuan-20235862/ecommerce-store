import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { productService } from "../../../services/product.service";

// Helper format VNĐ
const formatVND = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value,
  );

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async (page = 1, searchQuery = "") => {
    setLoading(true);
    try {
      const res = await productService.adminList({
        page,
        limit: 10,
        search: searchQuery || undefined,
      });
      setProducts(res.data.products || []);
      setPagination(res.data.pagination || {});
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(1, search);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Tìm kiếm với debounce thủ công
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(1, search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, fetchProducts]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn chắc chắn muốn xóa sản phẩm "${name}"?`)) return;
    try {
      await productService.remove(id);
      toast.success("Đã xóa sản phẩm thành công");
      fetchProducts(pagination.page, search);
    } catch (error) {
      toast.error(error.response?.data?.message || "Xóa sản phẩm thất bại");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchProducts(newPage, search);
  };

  // Tính tổng tồn kho từ variants
  const getTotalStock = (product) => {
    if (!product.variants || product.variants.length === 0) return 0;
    return product.variants.reduce((sum, v) => sum + v.stock, 0);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Quản lý sản phẩm
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {pagination.total} sản phẩm trong hệ thống
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <Plus size={16} />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 font-medium text-neutral-500">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 font-medium text-neutral-500">SKU</th>
                <th className="px-4 py-3 font-medium text-neutral-500">
                  Danh mục
                </th>
                <th className="px-4 py-3 font-medium text-neutral-500 text-right">
                  Giá bán
                </th>
                <th className="px-4 py-3 font-medium text-neutral-500 text-center">
                  Tồn kho
                </th>
                <th className="px-4 py-3 font-medium text-neutral-500 text-center">
                  Trạng thái
                </th>
                <th className="px-4 py-3 font-medium text-neutral-500 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="text-neutral-400">Đang tải...</div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-neutral-400"
                  >
                    {search
                      ? "Không tìm thấy sản phẩm nào"
                      : "Chưa có sản phẩm nào"}
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const stock = getTotalStock(product);
                  return (
                    <tr
                      key={product._id}
                      className="border-b border-neutral-100 transition hover:bg-neutral-50"
                    >
                      {/* Ảnh + Tên */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ImageOff
                                  size={16}
                                  className="text-neutral-300"
                                />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="max-w-50 truncate font-medium text-neutral-900">
                              {product.name}
                            </p>
                            {product.isFeatured && (
                              <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-amber-600">
                                <Star size={10} fill="currentColor" />
                                Nổi bật
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="px-4 py-3">
                        <span className="rounded bg-neutral-100 px-2 py-1 font-mono text-xs text-neutral-600">
                          {product.sku || "—"}
                        </span>
                      </td>

                      {/* Danh mục */}
                      <td className="px-4 py-3 text-neutral-600">
                        {product.category?.name || "—"}
                      </td>

                      {/* Giá */}
                      <td className="px-4 py-3 text-right font-medium text-neutral-900">
                        {formatVND(product.price)}
                        {product.compareAtPrice > 0 && (
                          <div className="text-xs text-neutral-400 line-through">
                            {formatVND(product.compareAtPrice)}
                          </div>
                        )}
                      </td>

                      {/* Tồn kho */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block min-w-10 rounded-full px-2 py-0.5 text-xs font-semibold ${
                            stock === 0
                              ? "bg-red-50 text-red-600"
                              : stock < 10
                                ? "bg-amber-50 text-amber-600"
                                : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {stock}
                        </span>
                      </td>

                      {/* Trạng thái */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            product.isActive
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-neutral-100 text-neutral-400"
                          }`}
                        >
                          {product.isActive ? "Đang bán" : "Ẩn"}
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() =>
                              navigate(`/admin/products/${product._id}/edit`)
                            }
                            className="rounded-md p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-blue-600"
                            title="Chỉnh sửa"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(product._id, product.name)
                            }
                            className="rounded-md p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                            title="Xóa"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
            <p className="text-xs text-neutral-500">
              Trang {pagination.page} / {pagination.totalPages} (
              {pagination.total} sản phẩm)
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-100 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1,
              ).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    pageNum === pagination.page
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-500 hover:bg-neutral-100"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-100 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
