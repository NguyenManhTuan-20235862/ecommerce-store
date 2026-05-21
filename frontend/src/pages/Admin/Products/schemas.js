import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Tên tối thiểu 2 ký tự").max(200, "Tên tối đa 200 ký tự"),
  description: z.string().max(5000, "Mô tả tối đa 5000 ký tự").default(""),
  price: z.coerce
    .number({ invalid_type_error: "Nhập giá hợp lệ" })
    .min(0, "Giá phải >= 0"),
  compareAtPrice: z.coerce.number().min(0).default(0),
  costPrice: z.coerce.number().min(0).default(0),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  brand: z.string().max(100).default(""),
  sku: z.string().max(50).default(""),
  material: z.string().max(200).default(""),
  careInstructions: z.string().max(500).default(""),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  variants: z
    .array(
      z.object({
        size: z.string().min(1, "Nhập size"),
        color: z.string().min(1, "Nhập màu sắc"),
        colorHex: z.string().default(""),
        stock: z.coerce
          .number({ invalid_type_error: "Nhập số hợp lệ" })
          .min(0, "Tồn kho >= 0"),
      })
    )
    .default([]),
});
