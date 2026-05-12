import { cityOptions } from "@/data/cityOptions";
import { userService } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, MapPin, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addressSchema = z.object({
  province: z.string().min(1, "Chọn tỉnh / thành phố"),
  district: z.string().min(1, "Chọn quận / huyện"),
  ward: z.string().min(2, "Nhập phường / xã"),
  detail: z.string().min(5, "Tối thiểu 5 ký tự"),
});

// ─── Address Card ────────────────────────────────────────────
function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  return (
    <div
      className={`relative rounded-2xl border-2 bg-white p-5 transition ${
        address.isDefault ? "border-[#004be3]" : "border-[#e4e2e1]"
      }`}
    >
      {address.isDefault && (
        <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#004be3] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          <Star className="h-3 w-3 fill-white" />
          Mặc định
        </span>
      )}

      <p className="pr-20 text-sm font-semibold text-[#2f2f2e]">
        {address.detail}, {address.ward}, {address.district}, {address.province}
      </p>

      <div className="mt-4 flex items-center gap-2">
        {!address.isDefault && (
          <button
            onClick={onSetDefault}
            className="flex items-center gap-1 rounded-full border border-[#004be3]/30 px-3 py-1.5 text-xs font-bold text-[#004be3] transition hover:bg-[#004be3]/5"
          >
            <Star className="h-3 w-3" />
            Đặt mặc định
          </button>
        )}
        <button
          onClick={onEdit}
          className="flex items-center gap-1 rounded-full border border-black/10 px-3 py-1.5 text-xs font-bold text-[#2f2f2e] transition hover:bg-[#f3f0ef]"
        >
          <Pencil className="h-3 w-3" />
          Sửa
        </button>
        <button
          onClick={onDelete}
          className="ml-auto flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-500 transition hover:bg-red-50"
        >
          <Trash2 className="h-3 w-3" />
          Xóa
        </button>
      </div>
    </div>
  );
}

// ─── Address Form Modal ───────────────────────────────────────
function AddressFormModal({ initial, onClose, onSave }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [saving, setSaving] = useState(false);
  const cityRef = useRef(null);
  const districtRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      province: initial?.province || "",
      district: initial?.district || "",
      ward: initial?.ward || "",
      detail: initial?.detail || "",
    },
  });

  const selectedProvince = watch("province");
  const selectedDistrict = watch("district");

  const selectedCityData = useMemo(
    () => cityOptions.find((c) => c.value === selectedProvince) || null,
    [selectedProvince],
  );

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await onSave(data);
    } finally {
      setSaving(false);
    }
  };

  const handleBlur = (e, ref) => {
    if (!ref.current?.contains(e.relatedTarget)) setOpenDropdown(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-[#5c5b5b] transition hover:bg-[#f3f0ef]"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="font-heading text-2xl font-extrabold uppercase tracking-[-0.03em] text-[#2f2f2e]">
          {initial ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* Province */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
              Tỉnh / Thành phố <span className="text-red-500">*</span>
            </p>
            <div
              ref={cityRef}
              className="relative"
              onBlur={(e) => handleBlur(e, cityRef)}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown((p) => (p === "city" ? null : "city"))}
                className={`flex h-12 w-full items-center rounded-xl bg-[#f3f0ef] px-4 pr-10 text-left text-sm ${errors.province ? "ring-2 ring-red-400" : ""}`}
              >
                <span className={selectedCityData ? "text-[#2f2f2e]" : "text-[#6b7280]/60"}>
                  {selectedCityData?.label || "Chọn tỉnh / thành phố"}
                </span>
                <ChevronDown className={`absolute right-3 h-4 w-4 text-[#6b7280] transition ${openDropdown === "city" ? "rotate-180" : ""}`} />
              </button>
              {openDropdown === "city" && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-48 overflow-y-auto rounded-xl border border-black/10 bg-white shadow-lg">
                  {cityOptions.map((city) => (
                    <button
                      key={city.value}
                      type="button"
                      onClick={() => {
                        setValue("province", city.value, { shouldValidate: true });
                        setValue("district", "", { shouldValidate: false });
                        setOpenDropdown(null);
                      }}
                      className="block w-full px-4 py-2.5 text-left text-sm text-[#2f2f2e] hover:bg-[#f3f0ef]"
                    >
                      {city.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.province && (
              <p className="text-xs text-red-500">{errors.province.message}</p>
            )}
          </div>

          {/* District */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
              Quận / Huyện <span className="text-red-500">*</span>
            </p>
            <div
              ref={districtRef}
              className="relative"
              onBlur={(e) => handleBlur(e, districtRef)}
            >
              <button
                type="button"
                disabled={!selectedCityData}
                onClick={() => setOpenDropdown((p) => (p === "district" ? null : "district"))}
                className={`flex h-12 w-full items-center rounded-xl bg-[#f3f0ef] px-4 pr-10 text-left text-sm disabled:cursor-not-allowed disabled:opacity-60 ${errors.district ? "ring-2 ring-red-400" : ""}`}
              >
                <span className={selectedDistrict ? "text-[#2f2f2e]" : "text-[#6b7280]/60"}>
                  {selectedDistrict || "Chọn quận / huyện"}
                </span>
                <ChevronDown className={`absolute right-3 h-4 w-4 text-[#6b7280] transition ${openDropdown === "district" ? "rotate-180" : ""}`} />
              </button>
              {openDropdown === "district" && selectedCityData && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-48 overflow-y-auto rounded-xl border border-black/10 bg-white shadow-lg">
                  {selectedCityData.districts.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setValue("district", d, { shouldValidate: true });
                        setOpenDropdown(null);
                      }}
                      className="block w-full px-4 py-2.5 text-left text-sm text-[#2f2f2e] hover:bg-[#f3f0ef]"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.district && (
              <p className="text-xs text-red-500">{errors.district.message}</p>
            )}
          </div>

          {/* Ward */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
              Phường / Xã <span className="text-red-500">*</span>
            </p>
            <input
              {...register("ward")}
              placeholder="Phường 1"
              className={`h-12 w-full rounded-xl bg-[#f3f0ef] px-4 text-sm text-[#2f2f2e] outline-none placeholder:text-[#6b7280]/60 ${errors.ward ? "ring-2 ring-red-400" : ""}`}
            />
            {errors.ward && (
              <p className="text-xs text-red-500">{errors.ward.message}</p>
            )}
          </div>

          {/* Detail */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
              Địa chỉ chi tiết <span className="text-red-500">*</span>
            </p>
            <textarea
              {...register("detail")}
              placeholder="Số nhà, tên đường, tòa nhà..."
              className={`h-24 w-full resize-none rounded-xl bg-[#f3f0ef] px-4 py-3 text-sm text-[#2f2f2e] outline-none placeholder:text-[#6b7280]/60 ${errors.detail ? "ring-2 ring-red-400" : ""}`}
            />
            {errors.detail && (
              <p className="text-xs text-red-500">{errors.detail.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-black/10 py-3 text-sm font-bold text-[#2f2f2e] transition hover:bg-[#f3f0ef]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-gradient-to-r from-[#004be3] to-[#819bff] py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {saving ? "Đang lưu..." : initial ? "Cập nhật" : "Thêm địa chỉ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await userService.getAddresses();
      setAddresses(res.data.data || []);
    } catch {
      toast.error("Không thể tải danh sách địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("Xóa địa chỉ này?")) return;
    try {
      const res = await userService.deleteAddress(addressId);
      setAddresses(res.data.data);
      toast.success("Đã xóa địa chỉ");
    } catch {
      toast.error("Không thể xóa địa chỉ");
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const res = await userService.setDefaultAddress(addressId);
      setAddresses(res.data.data);
      toast.success("Đã đặt địa chỉ mặc định");
    } catch {
      toast.error("Không thể đặt địa chỉ mặc định");
    }
  };

  const handleSave = async (data) => {
    try {
      let res;
      if (editTarget) {
        res = await userService.updateAddress(editTarget._id, data);
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        res = await userService.addAddress(data);
        toast.success("Thêm địa chỉ thành công");
      }
      setAddresses(res.data.data);
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-extrabold uppercase tracking-[-0.03em] text-[#2f2f2e]">
            Sổ địa chỉ
          </h2>
          <p className="mt-1 text-sm text-[#5c5b5b]">
            {addresses.length}/10 địa chỉ đã lưu
          </p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowModal(true); }}
          disabled={addresses.length >= 10}
          className="flex items-center gap-2 rounded-full bg-[#004be3] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Thêm địa chỉ
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16 text-center text-sm text-[#5c5b5b]">Đang tải...</div>
      ) : addresses.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#e4e2e1] py-16 text-center">
          <MapPin className="mx-auto h-12 w-12 text-[#dfdcdc]" />
          <p className="mt-4 font-semibold text-[#2f2f2e]">Chưa có địa chỉ nào</p>
          <p className="mt-1 text-sm text-[#5c5b5b]">
            Thêm địa chỉ để thanh toán nhanh hơn
          </p>
          <button
            onClick={() => { setEditTarget(null); setShowModal(true); }}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#004be3] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            Thêm địa chỉ đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onEdit={() => { setEditTarget(address); setShowModal(true); }}
              onDelete={() => handleDelete(address._id)}
              onSetDefault={() => handleSetDefault(address._id)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddressFormModal
          initial={editTarget}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
