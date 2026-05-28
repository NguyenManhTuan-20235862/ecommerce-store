import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Image, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { fadeUpItem, modalContent, modalOverlay, staggerContainer } from "../../../animations/variants";
import { toast } from "sonner";
import { storeService } from "../../../services/store.service";
import { teamService } from "../../../services/team.service";
import { siteConfigService } from "../../../services/siteConfig.service";
import { getImageUrl } from "../../../utils/getImageUrl";
import api from "../../../services/api";

const TABS = ["Cửa hàng", "Thành viên", "Liên hệ"];

const inputCls =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-[#004be3] focus:ring-2 focus:ring-blue-50";

const CITY_KEY_OPTIONS = ["SG", "HN", "ĐN", "HP"];
const CITY_LABELS = { SG: "Sài Gòn", HN: "Hà Nội", ĐN: "Đà Nẵng", HP: "Hải Phòng" };

// ─────────────────────────────────────────────────────────
// Shared Image Upload Widget
// ─────────────────────────────────────────────────────────
function ImageUploader({ urlField, idField, form, setForm }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("images", file);
      const res = await api.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.urls?.[0];
      if (!url) throw new Error("Upload thất bại");
      const imgId = url.split("/uploads/")[1] ?? "";
      setForm((prev) => ({ ...prev, [urlField]: url, [idField]: imgId }));
      toast.success("Upload ảnh thành công");
    } catch {
      toast.error("Upload ảnh thất bại");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const currentUrl = form[urlField];

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Ảnh</label>
      <div
        className="relative flex h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 transition hover:border-neutral-400"
        onClick={() => fileRef.current?.click()}
      >
        {currentUrl ? (
          <img
            src={getImageUrl(currentUrl)}
            alt="preview"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-neutral-400">
            <Image size={28} />
            <span className="text-sm">Nhấn để upload ảnh</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-white border-t-transparent" />
          </div>
        )}
        {currentUrl && !uploading && (
          <div className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-2 py-1 text-[11px] font-semibold text-white">
            Nhấn để đổi ảnh
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Tab 1: Stores
// ─────────────────────────────────────────────────────────
const EMPTY_STORE = {
  name: "",
  cityKey: "SG",
  tag: "",
  address: "",
  time: "",
  phone: "",
  rating: 5.0,
  reviews: 0,
  mapSrc: "",
  mapsUrl: "",
  imgUrl: "",
  imgId: "",
  order: 0,
  isActive: true,
};

function StoresTab() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_STORE);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await storeService.getAllStores();
      setStores(res.data?.data ?? []);
    } catch {
      toast.error("Không tải được danh sách cửa hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStores(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_STORE, order: stores.length });
    setModalOpen(true);
  };

  const openEdit = (store) => {
    setEditing(store);
    setForm({
      name: store.name,
      cityKey: store.cityKey,
      tag: store.tag || "",
      address: store.address || "",
      time: store.time || "",
      phone: store.phone || "",
      rating: store.rating ?? 5.0,
      reviews: store.reviews ?? 0,
      mapSrc: store.mapSrc || "",
      mapsUrl: store.mapsUrl || "",
      imgUrl: store.imgUrl || "",
      imgId: store.imgId || "",
      order: store.order ?? 0,
      isActive: store.isActive !== false,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Tên cửa hàng là bắt buộc"); return; }
    setSaving(true);
    try {
      if (editing) {
        await storeService.update(editing._id, form);
        toast.success("Cập nhật thành công");
      } else {
        await storeService.create(form);
        toast.success("Tạo cửa hàng thành công");
      }
      closeModal();
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await storeService.remove(deleteTarget._id);
      toast.success("Đã xóa cửa hàng");
      fetchStores();
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <p className="py-12 text-center text-sm text-neutral-400">Đang tải...</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-neutral-500">{stores.length} cửa hàng</p>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <Plus size={16} /> Thêm cửa hàng
        </button>
      </div>

      {stores.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center text-sm text-neutral-400">
          Chưa có cửa hàng nào.
        </div>
      ) : (
        <motion.div
          key={stores.length}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stores.map((store) => (
            <motion.div
              key={store._id}
              variants={fadeUpItem}
              className={`group relative rounded-xl border border-neutral-200 bg-white overflow-hidden transition hover:shadow-md ${!store.isActive ? "opacity-60" : ""}`}
            >
              <div className="h-32 bg-neutral-100 relative overflow-hidden">
                {store.imgUrl ? (
                  <img
                    src={getImageUrl(store.imgUrl)}
                    alt={store.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
                    <Image size={28} />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(store)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-800 shadow transition hover:bg-neutral-100"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(store)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow transition hover:bg-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-1">
                  <p className="font-semibold text-sm text-neutral-900 truncate">{store.name}</p>
                  <span className="shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold text-neutral-500">
                    {store.cityKey}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-neutral-400 truncate">{store.address || "—"}</p>
                {!store.isActive && (
                  <span className="mt-1 inline-block rounded bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-600">
                    Ẩn
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
      {modalOpen && (
        <motion.div {...modalOverlay} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div {...modalContent} className="flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl max-h-[calc(100vh-2rem)]">
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-6 py-4">
              <h2 className="text-base font-bold text-neutral-900">
                {editing ? "Chỉnh sửa cửa hàng" : "Thêm cửa hàng mới"}
              </h2>
              <button onClick={closeModal} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 px-6 py-5">
              <ImageUploader urlField="imgUrl" idField="imgId" form={form} setForm={setForm} />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Tên cửa hàng <span className="text-red-500">*</span></label>
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="solar. Saigon Flagship" className={inputCls} autoFocus />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Thành phố <span className="text-red-500">*</span></label>
                  <select value={form.cityKey} onChange={(e) => setForm((f) => ({ ...f, cityKey: e.target.value }))} className={inputCls}>
                    {CITY_KEY_OPTIONS.map((k) => (
                      <option key={k} value={k}>{k} — {CITY_LABELS[k]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Tag</label>
                  <input value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))} placeholder="✦ flagship" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Điện thoại</label>
                  <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="028 73 071 175" className={inputCls} />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Địa chỉ</label>
                <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="28 Tôn Đản, Q.04, TP. HCM" className={inputCls} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Giờ mở cửa</label>
                  <input value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} placeholder="T2-CN · 09:30 - 22:00" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Thứ tự</label>
                  <input type="number" min={0} value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Đánh giá (1–5)</label>
                  <input type="number" step="0.1" min={0} max={5} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Số đánh giá</label>
                  <input type="number" min={0} value={form.reviews} onChange={(e) => setForm((f) => ({ ...f, reviews: Number(e.target.value) }))} className={inputCls} />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Google Maps Embed URL (mapSrc)</label>
                <input value={form.mapSrc} onChange={(e) => setForm((f) => ({ ...f, mapSrc: e.target.value }))} placeholder="https://www.google.com/maps/embed?..." className={inputCls} />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Google Maps Link (mapsUrl)</label>
                <input value={form.mapsUrl} onChange={(e) => setForm((f) => ({ ...f, mapsUrl: e.target.value }))} placeholder="https://maps.google.com/?q=..." className={inputCls} />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-neutral-700">Kích hoạt</p>
                  <p className="text-xs text-neutral-400">Ẩn cửa hàng khỏi trang About</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="peer sr-only" />
                  <div className="peer h-5 w-9 rounded-full bg-neutral-200 transition after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-neutral-900 peer-checked:after:translate-x-4" />
                </label>
              </div>
            </div>

            <div className="flex shrink-0 justify-end gap-3 border-t border-neutral-200 px-6 py-4">
              <button onClick={closeModal} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">Hủy</button>
              <button onClick={handleSave} disabled={saving} className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50">
                {saving ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Tạo mới"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
      {deleteTarget && (
        <motion.div {...modalOverlay} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div {...modalContent} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-2 text-base font-bold text-neutral-900">Xóa cửa hàng?</h3>
            <p className="mb-6 text-sm text-neutral-500">
              Cửa hàng <strong>"{deleteTarget.name}"</strong> sẽ bị xóa vĩnh viễn.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50">Hủy</button>
              <button onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Xóa</button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Tab 2: Team Members
// ─────────────────────────────────────────────────────────
const EMPTY_MEMBER = {
  name: "",
  role: "",
  photoUrl: "",
  photoId: "",
  order: 0,
  isActive: true,
};

function TeamTab() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_MEMBER);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await teamService.getAllMembers();
      setMembers(res.data?.data ?? []);
    } catch {
      toast.error("Không tải được danh sách thành viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_MEMBER, order: members.length });
    setModalOpen(true);
  };

  const openEdit = (member) => {
    setEditing(member);
    setForm({
      name: member.name,
      role: member.role || "",
      photoUrl: member.photoUrl || "",
      photoId: member.photoId || "",
      order: member.order ?? 0,
      isActive: member.isActive !== false,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Tên thành viên là bắt buộc"); return; }
    setSaving(true);
    try {
      if (editing) {
        await teamService.update(editing._id, form);
        toast.success("Cập nhật thành công");
      } else {
        await teamService.create(form);
        toast.success("Tạo thành viên thành công");
      }
      closeModal();
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await teamService.remove(deleteTarget._id);
      toast.success("Đã xóa thành viên");
      fetchMembers();
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <p className="py-12 text-center text-sm text-neutral-400">Đang tải...</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-neutral-500">{members.length} thành viên</p>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <Plus size={16} /> Thêm thành viên
        </button>
      </div>

      {members.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center text-sm text-neutral-400">
          Chưa có thành viên nào.
        </div>
      ) : (
        <motion.div
          key={members.length}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {members.map((member) => (
            <motion.div
              key={member._id}
              variants={fadeUpItem}
              className={`group relative rounded-xl border border-neutral-200 bg-white overflow-hidden transition hover:shadow-md ${!member.isActive ? "opacity-60" : ""}`}
            >
              <div className="aspect-[3/4] bg-neutral-100 relative overflow-hidden">
                {member.photoUrl ? (
                  <img
                    src={getImageUrl(member.photoUrl)}
                    alt={member.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
                    <Image size={28} />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(member)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-800 shadow transition hover:bg-neutral-100"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(member)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow transition hover:bg-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-1">
                  <p className="font-semibold text-sm text-neutral-900 truncate">{member.name}</p>
                  <span className="shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold text-neutral-500">
                    #{member.order}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-neutral-400">{member.role || "—"}</p>
                {!member.isActive && (
                  <span className="mt-1 inline-block rounded bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-600">
                    Ẩn
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
      {modalOpen && (
        <motion.div {...modalOverlay} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div {...modalContent} className="flex w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl max-h-[calc(100vh-2rem)]">
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-6 py-4">
              <h2 className="text-base font-bold text-neutral-900">
                {editing ? "Chỉnh sửa thành viên" : "Thêm thành viên mới"}
              </h2>
              <button onClick={closeModal} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 px-6 py-5">
              <ImageUploader urlField="photoUrl" idField="photoId" form={form} setForm={setForm} />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Họ tên <span className="text-red-500">*</span></label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nguyễn Văn A" className={inputCls} autoFocus />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Vai trò</label>
                <input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="Head of Make" className={inputCls} />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Thứ tự</label>
                <input type="number" min={0} value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} className={inputCls} />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-neutral-700">Kích hoạt</p>
                  <p className="text-xs text-neutral-400">Ẩn thành viên khỏi trang About</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="peer sr-only" />
                  <div className="peer h-5 w-9 rounded-full bg-neutral-200 transition after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-neutral-900 peer-checked:after:translate-x-4" />
                </label>
              </div>
            </div>

            <div className="flex shrink-0 justify-end gap-3 border-t border-neutral-200 px-6 py-4">
              <button onClick={closeModal} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">Hủy</button>
              <button onClick={handleSave} disabled={saving} className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50">
                {saving ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Tạo mới"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
      {deleteTarget && (
        <motion.div {...modalOverlay} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div {...modalContent} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-2 text-base font-bold text-neutral-900">Xóa thành viên?</h3>
            <p className="mb-6 text-sm text-neutral-500">
              Thành viên <strong>"{deleteTarget.name}"</strong> sẽ bị xóa vĩnh viễn.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50">Hủy</button>
              <button onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Xóa</button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Tab 3: Contact (singleton)
// ─────────────────────────────────────────────────────────
function ContactTab() {
  const [form, setForm] = useState({ hotline: "", email: "", zalo: "", press: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    siteConfigService
      .getConfig()
      .then((res) => {
        const d = res.data?.data ?? {};
        setForm({
          hotline: d.hotline ?? "",
          email: d.email ?? "",
          zalo: d.zalo ?? "",
          press: d.press ?? "",
        });
      })
      .catch(() => toast.error("Không tải được thông tin liên hệ"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await siteConfigService.updateConfig(form);
      toast.success("Đã lưu thông tin liên hệ");
    } catch {
      toast.error("Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="py-12 text-center text-sm text-neutral-400">Đang tải...</p>;

  return (
    <div className="max-w-lg">
      <p className="mb-6 text-sm text-neutral-500">
        Thông tin hiển thị trong phần "Liên hệ" trên trang About.
      </p>

      <div className="space-y-4">
        {[
          { field: "hotline", label: "Hotline", placeholder: "028 73 071 175" },
          { field: "email", label: "Email", placeholder: "hello@solar.vn" },
          { field: "zalo", label: "Zalo OA", placeholder: "@solarvn" },
          { field: "press", label: "Báo chí", placeholder: "pr@solar.vn" },
        ].map(({ field, label, placeholder }) => (
          <div key={field}>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</label>
            <input
              value={form[field]}
              onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
              placeholder={placeholder}
              className={inputCls}
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
        >
          <Save size={15} />
          {saving ? "Đang lưu..." : "Lưu thông tin"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────
export default function AdminAboutPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <motion.div variants={fadeUpItem} initial="initial" animate="animate" className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Quản lý Về chúng tôi</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Cửa hàng, đội ngũ và thông tin liên hệ trên trang About
        </p>
      </motion.div>

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

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {activeTab === 0 && <StoresTab />}
            {activeTab === 1 && <TeamTab />}
            {activeTab === 2 && <ContactTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
