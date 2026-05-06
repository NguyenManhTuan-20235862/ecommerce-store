import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { categoryService } from "../../../services/category.service";
import { cn } from "../../../utils/cn";

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Tên danh mục là bắt buộc")
    .max(100, "Tên tối đa 100 ký tự"),
  description: z.string().max(500, "Mô tả tối đa 500 ký tự").default(""),
  isActive: z.boolean().default(true),
});

const inputCls = (hasError) =>
  cn(
    "w-full rounded-lg border px-3 py-2.5 text-sm text-neutral-900 outline-none transition",
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-neutral-300 focus:border-[#004be3] focus:ring-2 focus:ring-blue-50",
  );

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "", isActive: true },
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.list();
      setCategories(res.data.categories || []);
    } catch {
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditingCategory(null);
    reset({ name: "", description: "", isActive: true });
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    reset({
      name: cat.name,
      description: cat.description || "",
      isActive: cat.isActive,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    reset();
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory._id, data);
        toast.success("Cập nhật danh mục thành công");
      } else {
        await categoryService.create(data);
        toast.success("Tạo danh mục thành công");
      }
      closeModal();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra, thử lại sau");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn chắc chắn muốn xóa danh mục "${name}"?`)) return;
    try {
      await categoryService.remove(id);
      toast.success("Đã xóa danh mục");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Xóa thất bại");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Quản lý danh mục
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {loading ? "Đang tải..." : `${categories.length} danh mục trong hệ thống`}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <Plus size={16} />
          Thêm danh mục
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 font-medium text-neutral-500">
                  Tên danh mục
                </th>
                <th className="px-4 py-3 font-medium text-neutral-500">Slug</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Mô tả</th>
                <th className="px-4 py-3 text-center font-medium text-neutral-500">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-right font-medium text-neutral-500">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-neutral-400"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-neutral-400"
                  >
                    Chưa có danh mục nào
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="border-b border-neutral-100 transition last:border-0 hover:bg-neutral-50"
                  >
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {cat.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-neutral-100 px-2 py-1 font-mono text-xs text-neutral-500">
                        {cat.slug}
                      </span>
                    </td>
                    <td className="max-w-xs px-4 py-3 text-neutral-500">
                      <span className="block max-w-[280px] truncate">
                        {cat.description || (
                          <span className="text-neutral-300">—</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          cat.isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-neutral-100 text-neutral-400"
                        }`}
                      >
                        {cat.isActive ? "Hiển thị" : "Ẩn"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(cat)}
                          className="rounded-md p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-blue-600"
                          title="Chỉnh sửa"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="rounded-md p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Xóa"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <h2 className="text-base font-semibold text-neutral-900">
                {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
              {/* Tên */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name")}
                  placeholder="VD: Áo khoác, Quần jean..."
                  className={inputCls(!!errors.name)}
                  autoFocus
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-neutral-400">
                  Slug sẽ được tự động tạo từ tên danh mục
                </p>
              </div>

              {/* Mô tả */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Mô tả
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Mô tả ngắn về danh mục (không bắt buộc)..."
                  className={cn(inputCls(!!errors.description), "resize-none")}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Trạng thái (chỉ hiển thị khi edit) */}
              {editingCategory && (
                <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-700">
                      Trạng thái hiển thị
                    </p>
                    <p className="text-xs text-neutral-400">
                      Ẩn danh mục sẽ không hiện trên cửa hàng
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      {...register("isActive")}
                      className="peer sr-only"
                    />
                    <div className="peer h-5 w-9 rounded-full bg-neutral-200 transition after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-neutral-900 peer-checked:after:translate-x-4" />
                  </label>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
                >
                  {submitting
                    ? "Đang lưu..."
                    : editingCategory
                      ? "Cập nhật"
                      : "Tạo danh mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
