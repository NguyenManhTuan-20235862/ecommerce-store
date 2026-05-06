import { z } from "zod";

/**
 * Schema validation cho Checkout Form
 * Sử dụng Zod để validate thông tin giao hàng
 */
export const checkoutSchema = z.object({
  // Thông tin người nhận
  receiverName: z
    .string()
    .min(2, "Tên người nhận phải có ít nhất 2 ký tự")
    .max(100, "Tên người nhận không được quá 100 ký tự"),

  receiverPhone: z
    .string()
    .regex(
      /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
      "Số điện thoại không hợp lệ (VD: 0901234567)"
    ),

  receiverEmail: z
    .string()
    .email("Email không hợp lệ")
    .min(1, "Email không được để trống"),

  // Địa chỉ giao hàng
  province: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),

  district: z.string().min(1, "Vui lòng chọn quận/huyện"),

  ward: z.string().min(1, "Vui lòng nhập phường/xã"),

  detail: z
    .string()
    .min(10, "Địa chỉ chi tiết phải có ít nhất 10 ký tự")
    .max(500, "Địa chỉ chi tiết không được quá 500 ký tự"),

  // Phương thức thanh toán
  paymentMethod: z.enum(["COD", "VNPAY", "MOMO"], {
    errorMap: () => ({ message: "Vui lòng chọn phương thức thanh toán" }),
  }),

  // Mã giảm giá (optional)
  couponCode: z.string().optional(),
});

/**
 * Type inference từ schema
 * @typedef {z.infer<typeof checkoutSchema>} CheckoutFormData
 */
