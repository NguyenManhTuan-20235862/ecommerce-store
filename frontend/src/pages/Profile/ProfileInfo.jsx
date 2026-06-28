import { formatCurrency } from "@/utils/formatCurrency";
import { orderService } from "@/services/order.service";
import { wishlistService } from "@/services/wishlist.service";
import { userService } from "@/services";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Camera,
  Heart,
  KeyRound,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  Shield,
  ShoppingBag,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
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

function StatCard({ label, value, sub }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-[#f3f0ef] px-4 py-5 text-center">
      <p className="text-2xl font-extrabold text-[#2f2f2e]">{value}</p>
      {sub && <p className="mt-0.5 text-xs font-semibold text-[#004be3]">{sub}</p>}
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#5c5b5b]">{label}</p>
    </div>
  );
}

const QUICK_LINKS = [
  {
    to: "/profile/orders",
    icon: Package,
    label: "Đơn hàng",
    desc: "Theo dõi & lịch sử",
  },
  {
    to: "/profile/addresses",
    icon: MapPin,
    label: "Địa chỉ",
    desc: "Quản lý địa chỉ giao hàng",
  },
  {
    to: "/wishlist",
    icon: Heart,
    label: "Wishlist",
    desc: "Sản phẩm yêu thích",
  },
  {
    to: "/profile/change-password",
    icon: KeyRound,
    label: "Đổi mật khẩu",
    desc: "Bảo mật tài khoản",
  },
];

export default function ProfileInfo() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  const [stats, setStats] = useState({ orderCount: 0, totalSpent: 0, wishlistCount: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [ordersRes, wishlistRes] = await Promise.allSettled([
          orderService.getUserOrders(),
          wishlistService.getWishlist(),
        ]);

        const orders = ordersRes.status === "fulfilled" ? (ordersRes.value.data?.data ?? []) : [];
        const wishlist = wishlistRes.status === "fulfilled" ? (wishlistRes.value.data?.data ?? []) : [];

        const totalSpent = orders.reduce((sum, o) => sum + (o.finalAmount ?? 0), 0);

        setStats({
          orderCount: orders.length,
          totalSpent,
          wishlistCount: Array.isArray(wishlist) ? wishlist.length : 0,
        });
      } catch {
        // stats không quan trọng, bỏ qua lỗi
      }
    }
    fetchStats();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      setIsUploadingAvatar(true);
      const res = await userService.uploadAvatar(formData);
      setUser({ avatarUrl: res.data.avatarUrl });
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload ảnh thất bại");
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = "";
    }
  };

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
    ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="space-y-6">
      {/* ── Card 1: Avatar + thông tin + nút chỉnh sửa ── */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          {/* Avatar + tên */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="relative shrink-0">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#004be3_0%,#819bff_100%)] text-2xl font-extrabold text-white">
                  {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#2f2f2e] text-white shadow-md transition hover:brightness-125 disabled:opacity-60"
                title="Đổi ảnh đại diện"
              >
                {isUploadingAvatar ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Camera className="h-3.5 w-3.5" />
                )}
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
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

          {/* Nút chỉnh sửa */}
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="shrink-0 rounded-full border border-[#004be3]/20 bg-[#004be3]/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#004be3] transition hover:bg-[#004be3]/10"
            >
              Chỉnh sửa
            </button>
          )}
        </div>

        {/* InfoRow grid */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <InfoRow icon={User} label="Tên đăng nhập" value={user?.username} />
          <InfoRow icon={Shield} label="Vai trò" value={user?.role === "admin" ? "Quản trị viên" : "Khách hàng"} />
          {joinedDate && <InfoRow icon={Calendar} label="Ngày tham gia" value={joinedDate} />}
          <InfoRow icon={Phone} label="Số điện thoại" value={user?.phone || "Chưa cập nhật"} />
          <InfoRow icon={Mail} label="Email" value={user?.email} />
        </div>
      </div>

      {/* ── Card 2: Form chỉnh sửa (khi isEditing) hoặc Stats + Quick Links ── */}
      {isEditing ? (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h3 className="font-heading text-xl font-extrabold uppercase tracking-[-0.03em] text-[#2f2f2e]">
            Chỉnh sửa thông tin
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
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

            <p className="text-xs text-[#5c5b5b]/60">* Tên đăng nhập không thể thay đổi</p>

            <div className="flex gap-3 pt-1">
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
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#5c5b5b]">
              Tổng quan tài khoản
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Đơn hàng" value={stats.orderCount} />
              <StatCard
                label="Tổng chi tiêu"
                value={stats.totalSpent > 0 ? formatCurrency(stats.totalSpent) : "0 ₫"}
              />
              <StatCard label="Yêu thích" value={stats.wishlistCount} sub={stats.wishlistCount > 0 ? "sản phẩm" : null} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#5c5b5b]">
              Truy cập nhanh
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {QUICK_LINKS.map(({ to, icon: Icon, label, desc }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-black/5 bg-[#f9f6f5] px-4 py-5 text-center transition hover:border-[#004be3]/20 hover:bg-[#004be3]/5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition group-hover:bg-[#004be3] group-hover:text-white">
                    <Icon className="h-5 w-5 text-[#5c5b5b] transition group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#2f2f2e]">{label}</p>
                    <p className="mt-0.5 text-[10px] text-[#5c5b5b]">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
