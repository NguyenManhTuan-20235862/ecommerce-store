import { z } from "zod";

export const profileInfoSchema = z.object({
  displayName: z.string().min(2, "Tên tối thiểu 2 ký tự").max(50, "Tên tối đa 50 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .regex(/^(0|\+84)[0-9]{8,9}$/, "Số điện thoại không hợp lệ (VD: 0912345678)")
    .optional()
    .or(z.literal("")),
});

/**
 * Schema validation cho Change Password Form
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Mật khẩu hiện tại không được để trống"),

    newPassword: z
      .string()
      .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải có chữ hoa, chữ thường và số"
      ),

    confirmPassword: z
      .string()
      .min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

/**
 * Type inference từ schema
 * @typedef {z.infer<typeof changePasswordSchema>} ChangePasswordFormData
 */
