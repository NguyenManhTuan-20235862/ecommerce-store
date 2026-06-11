import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ExternalLink, GripVertical, Pencil, Plus, Save, Ticket, Trash2, X } from "lucide-react";
import { fadeUpItem, modalContent, modalOverlay, staggerContainer } from "../../../animations/variants";
import { toast } from "sonner";
import { saleConfigService } from "../../../services/saleConfig.service";
import { comboService } from "../../../services/combo.service";
import { productService } from "../../../services/product.service";
import { formatCurrency } from "../../../utils/formatCurrency";
import { getImageUrl } from "../../../utils/getImageUrl";

const TABS = ["Mã giảm giá", "Bậc thang ưu đãi", "Combo tiết kiệm"];

const inputCls =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-[#004be3] focus:ring-2 focus:ring-blue-50";

// ────────────────────────────────────────
// Tab 1: Coupons redirect
// ────────────────────────────────────────
function CouponsTab() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center py-16 gap-4 text-center"
    >
      <motion.div
        variants={fadeUpItem}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50"
      >
        <Ticket size={26} className="text-[#004be3]" />
      </motion.div>
      <motion.h3 variants={fadeUpItem} className="text-lg font-semibold text-neutral-800">
        Quản lý mã giảm giá
      </motion.h3>
      <motion.p variants={fadeUpItem} className="max-w-sm text-sm text-neutral-500">
        Mã giảm giá được quản lý tại trang riêng. Bật toggle{" "}
        <span className="font-medium text-[#004be3]">Hiện trên trang Sale</span> để mã xuất hiện
        công khai tại trang Khuyến Mãi.
      </motion.p>
      <motion.div variants={fadeUpItem}>
        <Link
          to="/admin/coupons"
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <ExternalLink size={15} />
          Đi đến Mã giảm giá
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ────────────────────────────────────────
// Tab 2: Tiers
// ────────────────────────────────────────
const EMPTY_TIER = { label: "", threshold: 0, discountPercent: 0, perks: [""] };

function TiersTab() {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    saleConfigService
      .getTiers()
      .then((res) => setTiers(res.data.data ?? []))
      .catch(() => toast.error("Không tải được bậc thang"))
      .finally(() => setLoading(false));
  }, []);

  const addTier = () => setTiers((prev) => [...prev, { ...EMPTY_TIER, order: prev.length }]);

  const removeTier = (i) => setTiers((prev) => prev.filter((_, idx) => idx !== i));

  const updateTier = (i, field, value) =>
    setTiers((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));

  const updatePerk = (ti, pi, value) =>
    setTiers((prev) =>
      prev.map((t, idx) => {
        if (idx !== ti) return t;
        const perks = [...t.perks];
        perks[pi] = value;
        return { ...t, perks };
      }),
    );

  const addPerk = (ti) =>
    setTiers((prev) =>
      prev.map((t, idx) => (idx === ti ? { ...t, perks: [...t.perks, ""] } : t)),
    );

  const removePerk = (ti, pi) =>
    setTiers((prev) =>
      prev.map((t, idx) =>
        idx === ti ? { ...t, perks: t.perks.filter((_, i) => i !== pi) } : t,
      ),
    );

  const save = async () => {
    for (const t of tiers) {
      if (!t.label.trim()) return toast.error("Mỗi bậc phải có nhãn");
      if (t.threshold < 0) return toast.error("Ngưỡng chi tiêu không được âm");
      if (t.discountPercent < 0 || t.discountPercent > 100)
        return toast.error("Phần trăm giảm phải 0–100");
    }
    setSaving(true);
    try {
      const payload = tiers.map((t, i) => ({
        ...t,
        label: t.label.trim(),
        perks: t.perks.map((p) => p.trim()).filter(Boolean),
        order: i,
      }));
      await saleConfigService.updateTiers(payload);
      toast.success("Đã lưu bậc thang ưu đãi");
    } catch {
      toast.error("Lưu thất bại, thử lại sau");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="py-12 text-center text-sm text-neutral-400">Đang tải...</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {tiers.length} bậc — thứ tự từ trên xuống tương ứng bậc 1, 2, 3...
        </p>
        <div className="flex gap-2">
          <button
            onClick={addTier}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
          >
            <Plus size={15} /> Thêm bậc
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
          >
            <Save size={15} />
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>

      {tiers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center text-sm text-neutral-400">
          Chưa có bậc nào. Nhấn "Thêm bậc" để bắt đầu.
        </div>
      ) : (
        <motion.div
          key={tiers.length}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              variants={fadeUpItem}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center gap-2">
                <GripVertical size={16} className="shrink-0 text-neutral-300" />
                <span className="min-w-[24px] text-xs font-bold text-neutral-400">#{i + 1}</span>
                <div className="flex flex-1 flex-wrap gap-3">
                  <div className="flex-1 min-w-[140px]">
                    <label className="mb-1 block text-xs font-medium text-neutral-500">Nhãn</label>
                    <input
                      value={tier.label}
                      onChange={(e) => updateTier(i, "label", e.target.value)}
                      placeholder="VD: Bạc, Vàng, Kim Cương..."
                      className={inputCls}
                    />
                  </div>
                  <div className="w-40">
                    <label className="mb-1 block text-xs font-medium text-neutral-500">
                      Ngưỡng chi tiêu (₫)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={tier.threshold}
                      onChange={(e) => updateTier(i, "threshold", Number(e.target.value))}
                      className={inputCls}
                    />
                  </div>
                  <div className="w-36">
                    <label className="mb-1 block text-xs font-medium text-neutral-500">
                      Giảm (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={tier.discountPercent}
                      onChange={(e) => updateTier(i, "discountPercent", Number(e.target.value))}
                      className={inputCls}
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeTier(i)}
                  className="ml-1 shrink-0 rounded-md p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Perks */}
              <div className="ml-8 space-y-1.5">
                <label className="block text-xs font-medium text-neutral-500">
                  Quyền lợi (mỗi dòng 1 ưu đãi)
                </label>
                {tier.perks.map((perk, pi) => (
                  <div key={pi} className="flex gap-2">
                    <input
                      value={perk}
                      onChange={(e) => updatePerk(i, pi, e.target.value)}
                      placeholder="VD: Miễn phí ship toàn quốc"
                      className={inputCls}
                    />
                    <button
                      onClick={() => removePerk(i, pi)}
                      className="shrink-0 rounded-md p-2 text-neutral-300 transition hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addPerk(i)}
                  className="text-xs text-[#004be3] transition hover:underline"
                >
                  + Thêm quyền lợi
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ────────────────────────────────────────
// Tab 3: Combos
// ────────────────────────────────────────
const EMPTY_COMBO = {
  name: "",
  subtitle: "",
  products: [],
  comboPrice: "",
  isActive: true,
  order: 0,
};

function CombosTab() {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState(null);
  const [form, setForm] = useState(EMPTY_COMBO);
  const [submitting, setSubmitting] = useState(false);

  // Product picker state
  const [allProducts, setAllProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  const fetchCombos = async () => {
    setLoading(true);
    try {
      const res = await comboService.getAdmin();
      setCombos(res.data.data ?? []);
    } catch {
      toast.error("Không tải được combo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombos();
    productService
      .list({ limit: 200 })
      .then((res) => setAllProducts(res.data?.products ?? []))
      .catch(() => {});
  }, []);

  // Đóng picker khi click ngoài
  useEffect(() => {
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setShowPicker(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openCreate = () => {
    setEditingCombo(null);
    setForm({ ...EMPTY_COMBO, order: combos.length });
    setModalOpen(true);
  };

  const openEdit = (combo) => {
    setEditingCombo(combo);
    setForm({
      name: combo.name,
      subtitle: combo.subtitle || "",
      products: combo.products.map((p) => ({
        product: p.product?._id ?? p.product,
        label: p.label || "",
        _productData: p.product ?? null,
      })),
      comboPrice: combo.comboPrice,
      isActive: combo.isActive,
      order: combo.order ?? 0,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCombo(null);
    setForm(EMPTY_COMBO);
    setProductSearch("");
  };

  const addProduct = (product) => {
    if (form.products.some((p) => (p.product._id || p.product) === product._id)) return;
    setForm((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { product: product._id, label: "", _productData: product },
      ],
    }));
    setShowPicker(false);
    setProductSearch("");
  };

  const removeProduct = (idx) =>
    setForm((prev) => ({ ...prev, products: prev.products.filter((_, i) => i !== idx) }));

  const filteredProducts = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) &&
      !form.products.some((fp) => fp.product === p._id),
  );

  const originalTotal = form.products.reduce((sum, fp) => {
    const p = fp._productData;
    return sum + (p?.price ?? 0);
  }, 0);

  const onSubmit = async () => {
    if (!form.name.trim()) return toast.error("Tên combo là bắt buộc");
    if (form.products.length < 2) return toast.error("Combo phải có ít nhất 2 sản phẩm");
    if (!form.comboPrice || Number(form.comboPrice) < 0)
      return toast.error("Nhập giá combo hợp lệ");

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        subtitle: form.subtitle.trim(),
        products: form.products.map((p) => ({
          product: p.product,
          label: p.label || "",
        })),
        comboPrice: Number(form.comboPrice),
        isActive: form.isActive,
        order: Number(form.order) || 0,
      };
      if (editingCombo) {
        await comboService.update(editingCombo._id, payload);
        toast.success("Đã cập nhật combo");
      } else {
        await comboService.create(payload);
        toast.success("Đã tạo combo");
      }
      closeModal();
      fetchCombos();
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (combo) => {
    if (!window.confirm(`Xóa combo "${combo.name}"?`)) return;
    try {
      await comboService.remove(combo._id);
      toast.success("Đã xóa combo");
      fetchCombos();
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const savings = (combo) => {
    const total = combo.products.reduce((s, p) => s + (p.product?.price ?? 0), 0);
    return total - combo.comboPrice;
  };

  if (loading) return <p className="py-12 text-center text-sm text-neutral-400">Đang tải...</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-neutral-500">{combos.length} combo</p>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <Plus size={16} /> Thêm combo
        </button>
      </div>

      {combos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center text-sm text-neutral-400">
          Chưa có combo nào.
        </div>
      ) : (
        <motion.div
          key={combos.length}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {combos.map((combo) => (
            <motion.div
              key={combo._id}
              variants={fadeUpItem}
              className="group relative rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-neutral-900">{combo.name}</h3>
                  {combo.subtitle && (
                    <p className="text-xs text-neutral-400">{combo.subtitle}</p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    combo.isActive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {combo.isActive ? "Hoạt động" : "Ẩn"}
                </span>
              </div>

              <div className="mb-3 space-y-1.5">
                {combo.products.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {p.product?.images?.[0] ? (
                      <img
                        src={getImageUrl(p.product.images[0])}
                        alt={p.product.name}
                        className="h-8 w-8 rounded-md object-cover bg-neutral-100"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-md bg-neutral-100" />
                    )}
                    <span className="text-xs text-neutral-600 line-clamp-1">
                      {p.product?.name ?? "—"}
                    </span>
                    <span className="ml-auto shrink-0 text-xs text-neutral-400">
                      {formatCurrency(p.product?.price ?? 0)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                <div>
                  <p className="text-xs text-neutral-400">Giá combo</p>
                  <p className="font-semibold text-[#004be3]">
                    {formatCurrency(combo.comboPrice)}
                  </p>
                  {savings(combo) > 0 && (
                    <p className="text-xs text-emerald-600">
                      Tiết kiệm {formatCurrency(savings(combo))}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(combo)}
                    className="rounded-md p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-blue-600"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(combo)}
                    className="rounded-md p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal create/edit */}
      <AnimatePresence>
      {modalOpen && (
        <motion.div {...modalOverlay} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div {...modalContent} className="flex w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl max-h-[calc(100vh-2rem)]">
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <h2 className="text-base font-semibold text-neutral-900">
                {editingCombo ? "Chỉnh sửa combo" : "Thêm combo mới"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto space-y-4 px-6 py-5">
              {/* Tên */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Tên combo <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="VD: Bộ ngày phố"
                  className={inputCls}
                  autoFocus
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Mô tả ngắn
                </label>
                <input
                  value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                  placeholder="VD: Sneaker + Mũ bucket"
                  className={inputCls}
                />
              </div>

              {/* Sản phẩm */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Sản phẩm trong combo{" "}
                  <span className="text-neutral-400 font-normal">(tối thiểu 2)</span>
                </label>

                {form.products.length > 0 && (
                  <div className="mb-2 space-y-2">
                    {form.products.map((fp, idx) => {
                      const p = fp._productData;
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-lg border border-neutral-200 p-2"
                        >
                          {p?.images?.[0] ? (
                            <img
                              src={getImageUrl(p.images[0])}
                              alt={p.name}
                              className="h-9 w-9 shrink-0 rounded-md object-cover bg-neutral-100"
                            />
                          ) : (
                            <div className="h-9 w-9 shrink-0 rounded-md bg-neutral-100" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium text-neutral-800">
                              {p?.name ?? fp.product}
                            </p>
                            <p className="text-xs text-neutral-400">
                              {formatCurrency(p?.price ?? 0)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeProduct(idx)}
                            className="shrink-0 rounded-md p-1.5 text-neutral-300 transition hover:text-red-500"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Product picker */}
                <div ref={pickerRef} className="relative">
                  <input
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setShowPicker(true);
                    }}
                    onFocus={() => setShowPicker(true)}
                    placeholder="Tìm và thêm sản phẩm..."
                    className={inputCls}
                  />
                  {showPicker && filteredProducts.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                      {filteredProducts.slice(0, 20).map((p) => (
                        <button
                          key={p._id}
                          type="button"
                          onClick={() => addProduct(p)}
                          className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition hover:bg-neutral-50"
                        >
                          {p.images?.[0] ? (
                            <img
                              src={getImageUrl(p.images[0])}
                              alt={p.name}
                              className="h-8 w-8 shrink-0 rounded-md object-cover bg-neutral-100"
                            />
                          ) : (
                            <div className="h-8 w-8 shrink-0 rounded-md bg-neutral-100" />
                          )}
                          <span className="flex-1 truncate text-neutral-800">{p.name}</span>
                          <span className="shrink-0 text-xs text-neutral-400">
                            {formatCurrency(p.price)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Giá combo */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Giá combo (₫) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.comboPrice}
                    onChange={(e) => setForm((f) => ({ ...f, comboPrice: e.target.value }))}
                    placeholder="VD: 1130000"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Giá gốc (tự tính)
                  </label>
                  <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500">
                    {formatCurrency(originalTotal)}
                  </div>
                  {originalTotal > 0 && form.comboPrice > 0 && (
                    <p className="mt-1 text-xs text-emerald-600">
                      Tiết kiệm {formatCurrency(originalTotal - Number(form.comboPrice))}
                    </p>
                  )}
                </div>
              </div>

              {/* Order */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Thứ tự hiển thị
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                  className={inputCls}
                />
              </div>

              {/* isActive */}
              <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-neutral-700">Kích hoạt</p>
                  <p className="text-xs text-neutral-400">Ẩn combo khỏi trang Sale</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                    className="peer sr-only"
                  />
                  <div className="peer h-5 w-9 rounded-full bg-neutral-200 transition after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-neutral-900 peer-checked:after:translate-x-4" />
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 flex justify-end gap-3 border-t border-neutral-200 px-6 py-4">
              <button
                onClick={closeModal}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                Hủy
              </button>
              <button
                onClick={onSubmit}
                disabled={submitting}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
              >
                {submitting ? "Đang lưu..." : editingCombo ? "Cập nhật" : "Tạo combo"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

// ────────────────────────────────────────
// Main Page
// ────────────────────────────────────────
export default function AdminSalePage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <motion.div variants={fadeUpItem} initial="initial" animate="animate" className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Quản lý Khuyến Mãi</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Cấu hình mã giảm giá, bậc thang ưu đãi và combo tiết kiệm
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-neutral-100 p-1 w-fit">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === i
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {activeTab === 0 && <CouponsTab />}
            {activeTab === 1 && <TiersTab />}
            {activeTab === 2 && <CombosTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
