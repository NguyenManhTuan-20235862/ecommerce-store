import { userService } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { changePasswordSchema } from "./schemas";

/**
 * Change Password Page
 * Form đổi mật khẩu với validation
 */
export default function ChangePassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const response = await userService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (response.data?.success) {
        toast.success("Đổi mật khẩu thành công!");
        reset(); // Reset form
      } else {
        throw new Error(response.data?.message || "Đổi mật khẩu thất bại");
      }
    } catch (error) {
      console.error("Change password error:", error);

      // Xử lý lỗi cụ thể
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi đổi mật khẩu";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <div className="flex items-center gap-3">
        <KeyRound className="h-6 w-6 text-[#004be3]" />
        <h1 className="text-2xl font-bold text-[#2f2f2e]">Đổi mật khẩu</h1>
      </div>

      <p className="mt-2 text-sm text-[#5c5b5b]">
        Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 max-w-md space-y-6">
        {/* Current Password */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#2f2f2e]">
            Mật khẩu hiện tại <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              {...register("currentPassword")}
              placeholder="Nhập mật khẩu hiện tại"
              className={`h-14 w-full rounded-xl bg-[#f3f0ef] px-4 pr-12 text-base text-[#2f2f2e] outline-none placeholder:text-[#6b7280]/75 ${
                errors.currentPassword ? "ring-2 ring-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#2f2f2e]"
            >
              {showPasswords.current ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-sm text-red-500">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#2f2f2e]">
            Mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              {...register("newPassword")}
              placeholder="Nhập mật khẩu mới"
              className={`h-14 w-full rounded-xl bg-[#f3f0ef] px-4 pr-12 text-base text-[#2f2f2e] outline-none placeholder:text-[#6b7280]/75 ${
                errors.newPassword ? "ring-2 ring-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#2f2f2e]"
            >
              {showPasswords.new ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-red-500">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#2f2f2e]">
            Xác nhận mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder="Nhập lại mật khẩu mới"
              className={`h-14 w-full rounded-xl bg-[#f3f0ef] px-4 pr-12 text-base text-[#2f2f2e] outline-none placeholder:text-[#6b7280]/75 ${
                errors.confirmPassword ? "ring-2 ring-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#2f2f2e]"
            >
              {showPasswords.confirm ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#004be3_0%,#819bff_100%)] px-6 text-base font-bold uppercase tracking-[-0.02em] text-white shadow-[0_10px_20px_rgba(0,75,227,0.2)] transition hover:shadow-[0_15px_30px_rgba(0,75,227,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <KeyRound className="h-5 w-5" />
              Đổi mật khẩu
            </>
          )}
        </button>
      </form>
    </div>
  );
}
