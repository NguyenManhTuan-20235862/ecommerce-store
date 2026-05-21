import { zodResolver } from "@hookform/resolvers/zod";

const COLOR_MAP = {
  "đen": "#1a1a1a", "đen than": "#1c1917", "đen wash": "#2d2d2d",
  "trắng": "#ffffff", "trắng sữa": "#faf7f2",
  "xám": "#6b7280", "xám nhạt": "#d1d5db", "xám đậm": "#374151", "xám khói": "#4b5563",
  "đỏ": "#ef4444", "đỏ đậm": "#991b1b",
  "hồng": "#ec4899", "hồng nhạt": "#fbcfe8",
  "cam": "#f97316",
  "vàng": "#eab308",
  "xanh": "#3b82f6", "xanh lam": "#2563eb", "xanh nhạt": "#93c5fd",
  "xanh navy": "#1e3a5f", "xanh đậm": "#1e40af", "xanh đen": "#1e2d3d",
  "xanh slate": "#475569", "xanh rêu": "#4d7c0f", "xanh lá": "#22c55e",
  "xanh wash": "#4a6fa5", "xanh trung": "#3a6496",
  "navy": "#0f172a",
  "tím": "#a855f7", "tím nhạt": "#d8b4fe",
  "nâu": "#92400e", "nâu đất": "#78350f", "nâu cognac": "#8b4513", "nâu mocha": "#6b4423",
  "be": "#d4b896", "be cát": "#c4a882", "kem": "#fef9ee",
  "urban core": "#2f2f2e",
  "đen tech": "#111827",
  "trắng/đen": "#a0a0a0",
  "xám wash": "#8a9ba8",
  "đen/nâu": "#5c3a1e",
};

const guessHex = (name) => COLOR_MAP[name?.trim().toLowerCase()] ?? null;
import { ImageOff, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { categoryService } from "../../../services/category.service";
import { productService } from "../../../services/product.service";
import { cn } from "../../../utils/cn";
import { productSchema } from "./schemas";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [sizeChart, setSizeChart] = useState({ headers: [], rows: [] });
  const [categories, setCategories] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      compareAtPrice: "",
      costPrice: "",
      category: "",
      brand: "",
      sku: "",
      material: "",
      careInstructions: "",
      isFeatured: false,
      isActive: true,
      variants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  useEffect(() => {
    categoryService
      .list()
      .then((res) => setCategories(res.data.categories || []))
      .catch(() => toast.error("Không thể tải danh mục"));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    productService
      .getById(id)
      .then((res) => {
        const p = res.data.product;
        reset({
          name: p.name || "",
          description: p.description || "",
          price: p.price ?? "",
          compareAtPrice: p.compareAtPrice || "",
          costPrice: p.costPrice || "",
          category: p.category?._id || "",
          brand: p.brand || "",
          sku: p.sku || "",
          material: p.material || "",
          careInstructions: p.careInstructions || "",
          isFeatured: p.isFeatured || false,
          isActive: p.isActive ?? true,
          variants: p.variants || [],
        });
        setImages(p.images || []);
        setSizeChart(p.sizeChart || { headers: [], rows: [] });
      })
      .catch(() => toast.error("Không thể tải thông tin sản phẩm"))
      .finally(() => setLoadingProduct(false));
  }, [id, isEdit, reset]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const remaining = 5 - images.length;
    if (remaining <= 0) {
      toast.error("Tối đa 5 ảnh");
      return;
    }

    setUploading(true);
    try {
      const res = await productService.uploadImages(files.slice(0, remaining));
      const urls = res.data.urls || [];
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload ảnh thất bại");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const scAddColumn = () => {
    setSizeChart((prev) => ({
      headers: [...prev.headers, ""],
      rows: prev.rows.map((r) => [...r, ""]),
    }));
  };

  const scRemoveColumn = (colIdx) => {
    setSizeChart((prev) => ({
      headers: prev.headers.filter((_, i) => i !== colIdx),
      rows: prev.rows.map((r) => r.filter((_, i) => i !== colIdx)),
    }));
  };

  const scUpdateHeader = (colIdx, val) => {
    setSizeChart((prev) => {
      const headers = [...prev.headers];
      headers[colIdx] = val;
      return { ...prev, headers };
    });
  };

  const scAddRow = () => {
    setSizeChart((prev) => ({
      ...prev,
      rows: [...prev.rows, prev.headers.map(() => "")],
    }));
  };

  const scRemoveRow = (rowIdx) => {
    setSizeChart((prev) => ({
      ...prev,
      rows: prev.rows.filter((_, i) => i !== rowIdx),
    }));
  };

  const scUpdateCell = (rowIdx, colIdx, val) => {
    setSizeChart((prev) => {
      const rows = prev.rows.map((r, ri) =>
        ri === rowIdx ? r.map((c, ci) => (ci === colIdx ? val : c)) : r,
      );
      return { ...prev, rows };
    });
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const sizeChartPayload =
        sizeChart.headers.length > 0 ? sizeChart : null;
      const payload = { ...data, images, sizeChart: sizeChartPayload };
      if (isEdit) {
        await productService.update(id, payload);
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        await productService.create(payload);
        toast.success("Tạo sản phẩm thành công");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lưu sản phẩm thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (hasError) =>
    cn(
      "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-50",
      hasError ? "border-red-400" : "border-neutral-300"
    );

  if (loadingProduct) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-neutral-400" size={28} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/admin/products"
          className="mb-2 inline-flex items-center gap-1 text-sm text-neutral-400 transition hover:text-neutral-700"
        >
          ← Sản phẩm
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ===== CỘT TRÁI — Thông tin cơ bản + Biến thể ===== */}
          <div className="space-y-6 lg:col-span-2">
            {/* Thông tin cơ bản */}
            <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-base font-semibold text-neutral-900">
                Thông tin cơ bản
              </h2>
              <div className="space-y-4">
                {/* Tên */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("name")}
                    placeholder="Áo thun oversize premium..."
                    className={inputCls(errors.name)}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Mô tả */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    placeholder="Mô tả chi tiết về sản phẩm..."
                    className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                  />
                </div>

                {/* Giá vốn + Giá bán + Giá gốc */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      Giá vốn (VNĐ)
                      <span className="ml-1 text-[11px] font-normal text-neutral-400">(nhập hàng)</span>
                    </label>
                    <input
                      {...register("costPrice")}
                      type="number"
                      min={0}
                      placeholder="200000"
                      className={inputCls(false)}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      Giá bán (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("price")}
                      type="number"
                      min={0}
                      placeholder="450000"
                      className={inputCls(errors.price)}
                    />
                    {errors.price && (
                      <p className="mt-1.5 text-xs text-red-500">{errors.price.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      Giá gốc (VNĐ)
                      <span className="ml-1 text-[11px] font-normal text-neutral-400">(gạch ngang)</span>
                    </label>
                    <input
                      {...register("compareAtPrice")}
                      type="number"
                      min={0}
                      placeholder="600000"
                      className={inputCls(false)}
                    />
                  </div>
                </div>

                {/* SKU + Thương hiệu */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      SKU
                    </label>
                    <input
                      {...register("sku")}
                      placeholder="VU-TEE-001"
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 font-mono text-sm uppercase text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      Thương hiệu
                    </label>
                    <input
                      {...register("brand")}
                      placeholder="Vibe Urban"
                      className={inputCls(false)}
                    />
                  </div>
                </div>

                {/* Chất liệu + Bảo quản */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      Chất liệu
                    </label>
                    <input
                      {...register("material")}
                      placeholder="100% Cotton"
                      className={inputCls(false)}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      Hướng dẫn bảo quản
                    </label>
                    <input
                      {...register("careInstructions")}
                      placeholder="Giặt tay, không vắt mạnh"
                      className={inputCls(false)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Biến thể */}
            <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-neutral-900">
                    Biến thể sản phẩm
                  </h2>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Size, màu sắc và tồn kho
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => append({ size: "", color: "", colorHex: "#000000", stock: 0 })}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  <Plus size={14} />
                  Thêm biến thể
                </button>
              </div>

              {fields.length === 0 ? (
                <div className="rounded-lg border border-dashed border-neutral-200 py-10 text-center">
                  <p className="text-sm text-neutral-400">Chưa có biến thể nào</p>
                  <button
                    type="button"
                    onClick={() => append({ size: "", color: "", colorHex: "#000000", stock: 0 })}
                    className="mt-2 text-sm text-blue-500 hover:underline"
                  >
                    + Thêm biến thể đầu tiên
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-[1fr_1fr_44px_100px_40px] gap-2 px-1 pb-1">
                    <p className="text-xs font-medium text-neutral-500">Size</p>
                    <p className="text-xs font-medium text-neutral-500">Màu sắc</p>
                    <p className="text-xs font-medium text-neutral-500">Màu</p>
                    <p className="text-xs font-medium text-neutral-500">Tồn kho</p>
                    <span />
                  </div>

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-[1fr_1fr_44px_100px_40px] items-start gap-2"
                    >
                      <div>
                        <input
                          {...register(`variants.${index}.size`)}
                          placeholder="M, L, XL..."
                          className={inputCls(errors.variants?.[index]?.size)}
                        />
                        {errors.variants?.[index]?.size && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.variants[index].size.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          {...register(`variants.${index}.color`, {
                            onChange: (e) => {
                              const hex = guessHex(e.target.value);
                              if (hex) setValue(`variants.${index}.colorHex`, hex);
                            },
                          })}
                          placeholder="Đỏ, Xanh navy..."
                          className={inputCls(errors.variants?.[index]?.color)}
                        />
                        {errors.variants?.[index]?.color && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.variants[index].color.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          {...register(`variants.${index}.colorHex`)}
                          type="color"
                          title="Chọn mã màu"
                          className="h-10.5 w-11 cursor-pointer rounded-lg border border-neutral-300 bg-white p-1 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                        />
                      </div>
                      <div>
                        <input
                          {...register(`variants.${index}.stock`)}
                          type="number"
                          min={0}
                          placeholder="0"
                          className={inputCls(errors.variants?.[index]?.stock)}
                        />
                        {errors.variants?.[index]?.stock && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.variants[index].stock.message}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="flex h-10.5 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
            {/* Bảng size */}
            <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-neutral-900">
                    Bảng size
                  </h2>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Để trống nếu sản phẩm không cần bảng size
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={scAddColumn}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                  >
                    <Plus size={14} /> Thêm cột
                  </button>
                  <button
                    type="button"
                    onClick={scAddRow}
                    disabled={sizeChart.headers.length === 0}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={14} /> Thêm hàng
                  </button>
                </div>
              </div>

              {sizeChart.headers.length === 0 ? (
                <div className="rounded-lg border border-dashed border-neutral-200 py-10 text-center">
                  <p className="text-sm text-neutral-400">Chưa có bảng size</p>
                  <button
                    type="button"
                    onClick={scAddColumn}
                    className="mt-2 text-sm text-blue-500 hover:underline"
                  >
                    + Thêm cột đầu tiên
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        {sizeChart.headers.map((h, ci) => (
                          <th key={ci} className="pb-2 pr-2 text-left font-normal">
                            <div className="flex items-center gap-1">
                              <input
                                value={h}
                                onChange={(e) => scUpdateHeader(ci, e.target.value)}
                                placeholder={`Cột ${ci + 1}`}
                                className="w-full rounded border border-neutral-300 px-2 py-1.5 text-xs font-semibold text-neutral-700 outline-none focus:border-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => scRemoveColumn(ci)}
                                className="shrink-0 rounded p-1 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </th>
                        ))}
                        <th className="w-8" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {sizeChart.rows.map((row, ri) => (
                        <tr key={ri}>
                          {row.map((cell, ci) => (
                            <td key={ci} className="py-1.5 pr-2">
                              <input
                                value={cell}
                                onChange={(e) => scUpdateCell(ri, ci, e.target.value)}
                                placeholder="—"
                                className="w-full rounded border border-neutral-200 px-2 py-1.5 text-xs text-neutral-700 outline-none focus:border-blue-500"
                              />
                            </td>
                          ))}
                          <td className="py-1.5">
                            <button
                              type="button"
                              onClick={() => scRemoveRow(ri)}
                              className="flex h-7 w-7 items-center justify-center rounded border border-neutral-200 text-neutral-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

          {/* ===== CỘT PHẢI — Ảnh + Phân loại + Actions ===== */}
          <div className="space-y-6">
            {/* Ảnh sản phẩm */}
            <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-neutral-900">
                Ảnh sản phẩm
              </h2>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || images.length >= 5}
                className="mb-4 flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-200 py-8 text-neutral-400 transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Upload size={20} />
                )}
                <span className="text-sm">
                  {uploading
                    ? "Đang tải lên..."
                    : images.length >= 5
                      ? "Đã đủ 5 ảnh"
                      : "Nhấn để tải ảnh lên"}
                </span>
                {!uploading && images.length < 5 && (
                  <span className="text-xs">
                    {images.length}/5 ảnh • JPEG, PNG, WebP, GIF
                  </span>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />

              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {images.map((url, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100"
                    >
                      <img
                        src={url}
                        alt={`Ảnh ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm text-neutral-600 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                      >
                        <X size={12} />
                      </button>
                      {idx === 0 && (
                        <div className="absolute bottom-1.5 left-1.5 rounded bg-neutral-900/70 px-1.5 py-0.5 text-[10px] text-white">
                          Ảnh chính
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg bg-neutral-50 py-8">
                  <ImageOff size={24} className="text-neutral-300" />
                  <p className="text-xs text-neutral-400">Chưa có ảnh nào</p>
                </div>
              )}
            </section>

            {/* Phân loại & Cài đặt */}
            <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-neutral-900">
                Phân loại & Cài đặt
              </h2>
              <div className="space-y-4">
                {/* Danh mục */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("category")}
                    className={cn(
                      "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-50",
                      errors.category ? "border-red-400" : "border-neutral-300"
                    )}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* isFeatured toggle */}
                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-neutral-200 p-3.5 transition hover:bg-neutral-50">
                  <div>
                    <p className="text-sm font-medium text-neutral-700">
                      Sản phẩm nổi bật
                    </p>
                    <p className="text-xs text-neutral-400">
                      Hiển thị trên trang chủ
                    </p>
                  </div>
                  <input
                    {...register("isFeatured")}
                    type="checkbox"
                    className="h-4 w-4 rounded accent-blue-500"
                  />
                </label>

                {/* isActive toggle */}
                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-neutral-200 p-3.5 transition hover:bg-neutral-50">
                  <div>
                    <p className="text-sm font-medium text-neutral-700">
                      Đang bán
                    </p>
                    <p className="text-xs text-neutral-400">
                      Hiển thị trên cửa hàng
                    </p>
                  </div>
                  <input
                    {...register("isActive")}
                    type="checkbox"
                    className="h-4 w-4 rounded accent-blue-500"
                  />
                </label>
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <Loader2 className="animate-spin" size={16} />}
                {submitting
                  ? "Đang lưu..."
                  : isEdit
                    ? "Lưu thay đổi"
                    : "Tạo sản phẩm"}
              </button>
              <Link
                to="/admin/products"
                className="block w-full rounded-xl border border-neutral-200 px-6 py-3 text-center text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
              >
                Hủy
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
