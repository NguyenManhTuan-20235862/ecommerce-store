import { userService } from "@/services";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Mail, Phone, Save, Shield, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { profileInfoSchema } from "./schemas";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#f3f0ef] px-4 py-3">
      <Icon className="h-4 w-4 shrink-0 text-[#5c5b5b]" />
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5c5b5b]">{label}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-[#2f2f2e]">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function ProfileInfo() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const res = await userService.updateProfile(data);
      const updated = res.data.data?.user;
      if (updated) {
        setUser({ displayName: updated.displayName, email: updated.email, phone: updated.phone });
      }
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset({ displayName: user?.displayName || "", email: user?.email || "", phone: user?.phone || "" });
    setIsEditing(false);
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div className="space-y-8">
      {/* Avatar + tên */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#004be3_0%,#819bff_100%)] text-2xl font-extrabold text-white">
            {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="font-heading text-2xl font-extrabold uppercase tracking-[-0.03em] text-[#2f2f2e]">
              {user?.displayName}
            </h2>
            <p className="mt-1 text-sm text-[#5c5b5b]">@{user?.username}</p>
            <span className="mt-2 inline-block rounded-full bg-[#f3f0ef] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#5c5b5b]">
              {user?.role === "admin" ? "Quản trị viên" : "Khách hàng"}
            </span>
          </div>
        </div>

        {/* Thông tin read-only */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <InfoRow icon={User} label="Tên đăng nhập" value={user?.username} />
          <InfoRow icon={Shield} label="Vai trò" value={user?.role === "admin" ? "Quản trị viên" : "Khách hàng"} />
          {joinedDate && <InfoRow icon={Calendar} label="Ngày tham gia" value={joinedDate} />}
          {user?.phone && !isEditing && <InfoRow icon={Phone} label="Số điện thoại" value={user?.phone} />}
          {user?.email && !isEditing && <InfoRow icon={Mail} label="Email" value={user?.email} />}
        </div>
      </div>

      {/* Form chỉnh sửa */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xl font-extrabold uppercase tracking-[-0.03em] text-[#2f2f2e]">
            Thông tin cá nhân
          </h3>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-full border border-[#004be3]/20 bg-[#004be3]/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#004be3] transition hover:bg-[#004be3]/10"
            >
              Chỉnh sửa
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            {/* Tên hiển thị */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#5c5b5b]">
                Tên hiển thị <span className="text-red-500">*</span>
              </label>
              <input
                {...register("displayName")}
                className="h-11 w-full rounded-xl border border-black/10 bg-[#f9f6f5] px-4 text-sm font-semibold text-[#2f2f2e] outline-none focus:border-[#004be3]/50 focus:ring-2 focus:ring-[#004be3]/10"
                placeholder="Nhập tên hiển thị"
              />
              {errors.displayName && (
                <p className="mt-1 text-xs text-red-500">{errors.displayName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#5c5b5b]">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register("email")}
                type="email"
                className="h-11 w-full rounded-xl border border-black/10 bg-[#f9f6f5] px-4 text-sm font-semibold text-[#2f2f2e] outline-none focus:border-[#004be3]/50 focus:ring-2 focus:ring-[#004be3]/10"
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#5c5b5b]">
                Số điện thoại
              </label>
              <input
                {...register("phone")}
                type="tel"
                className="h-11 w-full rounded-xl border border-black/10 bg-[#f9f6f5] px-4 text-sm font-semibold text-[#2f2f2e] outline-none focus:border-[#004be3]/50 focus:ring-2 focus:ring-[#004be3]/10"
                placeholder="0912345678"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[linear-gradient(135deg,#004be3_0%,#819bff_100%)] px-6 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_16px_rgba(0,75,227,0.2)] transition hover:shadow-[0_12px_24px_rgba(0,75,227,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="inline-flex h-11 items-center rounded-full border border-black/10 px-6 text-sm font-bold uppercase tracking-[0.08em] text-[#5c5b5b] transition hover:bg-[#f3f0ef]"
              >
                Hủy
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-[#f3f0ef] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5c5b5b]">Tên hiển thị</p>
                <p className="mt-0.5 text-sm font-semibold text-[#2f2f2e]">{user?.displayName || "—"}</p>
              </div>
              <div className="rounded-xl bg-[#f3f0ef] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5c5b5b]">Email</p>
                <p className="mt-0.5 text-sm font-semibold text-[#2f2f2e] break-all">{user?.email || "—"}</p>
              </div>
              <div className="rounded-xl bg-[#f3f0ef] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5c5b5b]">Số điện thoại</p>
                <p className="mt-0.5 text-sm font-semibold text-[#2f2f2e]">{user?.phone || "Chưa cập nhật"}</p>
              </div>
            </div>
            <p className="text-xs text-[#5c5b5b]/60">
              * Tên đăng nhập không thể thay đổi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
