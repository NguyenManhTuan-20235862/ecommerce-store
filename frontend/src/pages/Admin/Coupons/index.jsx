import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { couponService } from "../../../services/coupon.service";
import { cn } from "../../../utils/cn";
import { formatCurrency } from "../../../utils/formatCurrency";

const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Mã tối thiểu 3 ký tự")
    .max(20, "Mã tối đa 20 ký tự")
    .regex(/^[A-Z0-9]+$/, "Chỉ dùng chữ in hoa và số"),
  discountType: z.enum(["percent", "fixed"], {
    errorMap: () => ({ message: "Chọn loại giảm giá" }),
  }),
  discountValue: z.coerce.number().min(1, "Giá trị tối thiểu là 1"),
  minOrderValue: z.coerce.number().min(0, "Tối thiểu >= 0").default(0),
  maxUses: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.coerce.number().min(1, "Tối thiểu 1 lần").optional(),
  ),
  expiresAt: z.string().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

const inputCls = (hasError) =>
  cn(
    "w-full rounded-lg border px-3 py-2.5 text-sm text-neutral-900 outline-none transition",
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-neutral-300 focus:border-[#004be3] focus:ring-2 focus:ring-blue-50",
  );

const formatDiscount = (coupon) => {
  if (coupon.discountType === "percent") return `${coupon.discountValue}%`;
  return formatCurrency(coupon.discountValue);
};

const formatExpiry = (expiresAt) => {
  if (!expiresAt) return <span className="text-neutral-300">Không hết hạn</span>;
  return new Date(expiresAt).toLocaleDateString("vi-VN");
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      discountType: "percent",
      discountValue: "",
      minOrderValue: 0,
      maxUses: "",
      expiresAt: "",
      isActive: true,
    },
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await couponService.list();
      setCoupons(res.data.coupons || []);
    } catch {
      toast.error("Không thể tải danh sách mã giảm giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreate = () => {
    setEditingCoupon(null);
    reset({
      code: "",
      discountType: "percent",
      discountValue: "",
      minOrderValue: 0,
      maxUses: "",
      expiresAt: "",
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditingCoupon(coupon);
    reset({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue || 0,
      maxUses: coupon.maxUses ?? "",
      expiresAt: coupon.expiresAt
        ? new Date(coupon.expiresAt).toISOString().slice(0, 10)
        : "",
      isActive: coupon.isActive,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCoupon(null);
    reset();
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const { code: _code, ...rest } = data;
      const payload = {
        ...(editingCoupon ? rest : data),
        maxUses: data.maxUses || null,
        expiresAt: data.expiresAt || null,
      };
      if (editingCoupon) {
        await couponService.update(editingCoupon._id, payload);
        toast.success("Cập nhật mã giảm giá thành công");
      } else {
        await couponService.create(payload);
        toast.success("Tạo mã giảm giá thành công");
      }
      closeModal();
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra, thử lại sau");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Bạn chắc chắn muốn xóa mã "${code}"?`)) return;
    try {
      await couponService.remove(id);
      toast.success("Đã xóa mã giảm giá");
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xóa thất bại");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Quản lý mã giảm giá
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {loading ? "Đang tải..." : `${coupons.length} mã trong hệ thống`}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <Plus size={16} />
          Thêm mã giảm giá
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 font-medium text-neutral-500">Mã</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Giảm giá</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Đơn tối thiểu</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Đã dùng / Giới hạn</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Hết hạn</th>
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
                  <td colSpan={7} className="px-4 py-12 text-center text-neutral-400">
                    Đang tải...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-neutral-400">
                    Chưa có mã giảm giá nào
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr
                    key={coupon._id}
                    className="border-b border-neutral-100 transition last:border-0 hover:bg-neutral-50"
                  >
                    <td className="px-4 py-3">
                      <span className="rounded bg-neutral-100 px-2 py-1 font-mono text-xs font-semibold text-neutral-700">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {formatDiscount(coupon)}
                    </td>
                    <td className="px-4 py-3 text-neutral-500">
                      {coupon.minOrderValue > 0 ? (
                        formatCurrency(coupon.minOrderValue)
                      ) : (
                        <span className="text-neutral-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-500">
                      {coupon.usedCount}
                      {" / "}
                      {coupon.maxUses ?? <span className="text-neutral-400">∞</span>}
                    </td>
                    <td className="px-4 py-3 text-neutral-500">
                      {formatExpiry(coupon.expiresAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          coupon.isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-neutral-100 text-neutral-400"
                        }`}
                      >
                        {coupon.isActive ? "Đang hoạt động" : "Tắt"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(coupon)}
                          className="rounded-md p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-blue-600"
                          title="Chỉnh sửa"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id, coupon.code)}
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
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <h2 className="text-base font-semibold text-neutral-900">
                {editingCoupon ? "Chỉnh sửa mã giảm giá" : "Thêm mã giảm giá mới"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto p-6" style={{ maxHeight: "80vh" }}>
              {/* Mã (ẩn khi edit) */}
              {!editingCoupon && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Mã giảm giá <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("code")}
                    placeholder="VD: SUMMER20"
                    className={inputCls(!!errors.code)}
                    autoFocus
                    onInput={(e) => {
                      e.target.value = e.target.value.toUpperCase();
                    }}
                  />
                  {errors.code && (
                    <p className="mt-1 text-xs text-red-500">{errors.code.message}</p>
                  )}
                </div>
              )}

              {/* Loại giảm giá */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Loại giảm giá <span className="text-red-500">*</span>
                </label>
                <select {...register("discountType")} className={inputCls(!!errors.discountType)}>
                  <option value="percent">Phần trăm (%)</option>
                  <option value="fixed">Số tiền cố định (₫)</option>
                </select>
                {errors.discountType && (
                  <p className="mt-1 text-xs text-red-500">{errors.discountType.message}</p>
                )}
              </div>

              {/* Giá trị */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Giá trị giảm <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  {...register("discountValue")}
                  placeholder="VD: 20 (%) hoặc 50000 (₫)"
                  className={inputCls(!!errors.discountValue)}
                />
                {errors.discountValue && (
                  <p className="mt-1 text-xs text-red-500">{errors.discountValue.message}</p>
                )}
              </div>

              {/* Đơn hàng tối thiểu */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Đơn hàng tối thiểu (₫)
                </label>
                <input
                  type="number"
                  min={0}
                  {...register("minOrderValue")}
                  placeholder="0 = không yêu cầu"
                  className={inputCls(!!errors.minOrderValue)}
                />
                {errors.minOrderValue && (
                  <p className="mt-1 text-xs text-red-500">{errors.minOrderValue.message}</p>
                )}
              </div>

              {/* Giới hạn số lần dùng */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Giới hạn số lần dùng
                </label>
                <input
                  type="number"
                  min={1}
                  {...register("maxUses")}
                  placeholder="Để trống = không giới hạn"
                  className={inputCls(!!errors.maxUses)}
                />
                {errors.maxUses && (
                  <p className="mt-1 text-xs text-red-500">{errors.maxUses.message}</p>
                )}
              </div>

              {/* Ngày hết hạn */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Ngày hết hạn
                </label>
                <input
                  type="date"
                  {...register("expiresAt")}
                  className={inputCls(!!errors.expiresAt)}
                />
                <p className="mt-1 text-xs text-neutral-400">Để trống = không hết hạn</p>
              </div>

              {/* Trạng thái (chỉ edit) */}
              {editingCoupon && (
                <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Kích hoạt</p>
                    <p className="text-xs text-neutral-400">
                      Tắt mã sẽ không thể dùng khi đặt hàng
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
                  {submitting ? "Đang lưu..." : editingCoupon ? "Cập nhật" : "Tạo mã"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
