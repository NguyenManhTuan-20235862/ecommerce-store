import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Image, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { fadeUpItem, modalContent, modalOverlay, staggerContainer } from "../../../animations/variants";
import { lookbookService } from "../../../services/lookbook.service";
import api from "../../../services/api";

const ASPECT_OPTIONS = [
  { value: "16:9", label: "16:9 — Ngang rộng" },
  { value: "8:4", label: "8:4 — Ngang vừa" },
  { value: "4:5", label: "4:5 — Dọc thường" },
  { value: "3:4", label: "3:4 — Dọc cao" },
];

const ASPECT_CLASS = {
  "16:9": "aspect-video",
  "8:4": "aspect-[8/4]",
  "4:5": "aspect-[4/5]",
  "3:4": "aspect-[3/4]",
};

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  imageUrl: "",
  imageId: "",
  aspectRatio: "4:5",
  order: 0,
  isActive: true,
};

export default function AdminLookbook() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = tạo mới
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const fileRef = useRef(null);

  const fetchStories = async () => {
    try {
      const res = await lookbookService.getAllStories();
      setStories(res.data?.data ?? []);
    } catch {
      toast.error("Không thể tải danh sách stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStories(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, order: stories.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (story) => {
    setEditing(story);
    setForm({
      title: story.title,
      subtitle: story.subtitle || "",
      imageUrl: story.imageUrl || "",
      imageId: story.imageId || "",
      aspectRatio: story.aspectRatio || "4:5",
      order: story.order ?? 0,
      isActive: story.isActive !== false,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

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
      const imageId = url.split("/uploads/")[1] ?? "";
      setForm((prev) => ({ ...prev, imageUrl: url, imageId }));
      toast.success("Upload ảnh thành công");
    } catch {
      toast.error("Upload ảnh thất bại");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Nhập tiêu đề"); return; }
    setSaving(true);
    try {
      if (editing) {
        const res = await lookbookService.update(editing._id, form);
        setStories((prev) =>
          prev.map((s) => (s._id === editing._id ? res.data.data : s))
        );
        toast.success("Cập nhật thành công");
      } else {
        const res = await lookbookService.create(form);
        setStories((prev) => [...prev, res.data.data].sort((a, b) => a.order - b.order));
        toast.success("Tạo story thành công");
      }
      closeModal();
    } catch {
      toast.error("Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await lookbookService.remove(deleteTarget._id);
      setStories((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      toast.success("Đã xóa story");
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <motion.div variants={fadeUpItem} initial="initial" animate="animate" className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Lookbook Stories</h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            Quản lý các story card trên trang Lookbook — thứ tự hiển thị theo số Order.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
        >
          <Plus size={16} />
          Thêm Story
        </button>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-neutral-100">
              <div className="aspect-[4/5] rounded-xl bg-neutral-200" />
              <div className="p-3">
                <div className="mb-2 h-4 rounded bg-neutral-200 w-3/4" />
                <div className="h-3 rounded bg-neutral-200 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 py-20 text-center">
          <Image size={40} className="mb-4 text-neutral-300" />
          <p className="font-semibold text-neutral-500">Chưa có story nào</p>
          <p className="mt-1 text-sm text-neutral-400">Nhấn "Thêm Story" để bắt đầu</p>
        </div>
      ) : (
        <motion.div
          key={stories.length}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {stories.map((story) => (
            <motion.div
              key={story._id}
              variants={fadeUpItem}
              className={`group relative overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:shadow-md ${
                !story.isActive ? "opacity-50" : ""
              }`}
            >
              {/* Image */}
              <div className={`${ASPECT_CLASS[story.aspectRatio] ?? "aspect-[4/5]"} bg-neutral-100 relative overflow-hidden`}>
                {story.imageUrl ? (
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
                    <Image size={36} />
                  </div>
                )}
                {/* Hover actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(story)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-800 shadow transition hover:bg-neutral-100"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(story)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white shadow transition hover:bg-red-700"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm text-neutral-900 truncate">{story.title}</p>
                  <span className="shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold text-neutral-500">
                    #{story.order}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-neutral-400">{story.aspectRatio}</p>
                {!story.isActive && (
                  <span className="mt-1 inline-block rounded bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-600">
                    Ẩn
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create / Edit Modal */}
      <AnimatePresence>
      {modalOpen && (
        <motion.div {...modalOverlay} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div {...modalContent} className="flex w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl max-h-[calc(100vh-2rem)]">
            {/* Modal header */}
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-6 py-4">
              <h2 className="text-base font-bold text-neutral-900">
                {editing ? "Chỉnh sửa Story" : "Thêm Story mới"}
              </h2>
              <button onClick={closeModal} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">
                <X size={18} />
              </button>
            </div>

            {/* Modal body — scrollable */}
            <div className="flex-1 overflow-y-auto space-y-5 px-6 py-5">
              {/* Image upload */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Ảnh</label>
                <div
                  className="relative flex h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 transition hover:border-neutral-400"
                  onClick={() => fileRef.current?.click()}
                >
                  {form.imageUrl ? (
                    <img
                      src={form.imageUrl}
                      alt="preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-neutral-400">
                      <Image size={32} />
                      <span className="text-sm">Nhấn để upload ảnh</span>
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
                    </div>
                  )}
                  {form.imageUrl && !uploading && (
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

              {/* Tiêu đề */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Vd: NIGHT RIDE"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Phụ đề</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                  placeholder="Vd: #STORY 01 - NIGHT RIDE - 16:9"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                />
              </div>

              {/* Aspect Ratio + Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Tỉ lệ ảnh</label>
                  <select
                    value={form.aspectRatio}
                    onChange={(e) => setForm((p) => ({ ...p, aspectRatio: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                  >
                    {ASPECT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Thứ tự (Order)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.order}
                    onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Active toggle */}
              <label className="flex cursor-pointer items-center gap-3">
                <div
                  onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                  className={`relative h-6 w-11 rounded-full transition ${form.isActive ? "bg-neutral-900" : "bg-neutral-300"}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.isActive ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </div>
                <span className="text-sm font-medium text-neutral-700">
                  {form.isActive ? "Hiển thị trên trang Lookbook" : "Ẩn khỏi trang Lookbook"}
                </span>
              </label>
            </div>

            {/* Modal footer */}
            <div className="flex shrink-0 justify-end gap-3 border-t border-neutral-200 px-6 py-4">
              <button onClick={closeModal} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50">
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
              >
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
            <h3 className="mb-2 text-base font-bold text-neutral-900">Xóa story?</h3>
            <p className="mb-6 text-sm text-neutral-500">
              Story <strong>"{deleteTarget.title}"</strong> sẽ bị xóa vĩnh viễn cùng với ảnh.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
