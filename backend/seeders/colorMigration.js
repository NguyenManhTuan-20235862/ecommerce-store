import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

// Phải khớp với COLOR_MAP bên frontend/ProductForm.jsx
const COLOR_MAP = {
  "đen": "#1a1a1a", "đen than": "#1c1917", "đen wash": "#2d2d2d",
  "trắng": "#ffffff", "trắng sữa": "#faf7f2",
  "xám": "#6b7280", "xám nhạt": "#d1d5db", "xám đậm": "#374151", "xám khói": "#4b5563",
  "đỏ": "#ef4444", "đỏ đậm": "#991b1b",
  "hồng": "#ec4899", "hồng nhạt": "#fbcfe8",
  "cam": "#f97316",
  "vàng": "#eab308",
  "xanh": "#3b82f6", "xanh lam": "#2563eb", "xanh nhạt": "#93c5fd",
  "xanh navy": "#1e3a5f", "xanh đậm": "#1e40af", "xanh đen": "#1e2d3d",
  "xanh slate": "#475569", "xanh rêu": "#4d7c0f", "xanh lá": "#22c55e",
  "xanh wash": "#4a6fa5", "xanh trung": "#3a6496",
  "navy": "#0f172a",
  "tím": "#a855f7", "tím nhạt": "#d8b4fe",
  "nâu": "#92400e", "nâu đất": "#78350f", "nâu cognac": "#8b4513", "nâu mocha": "#6b4423",
  "be": "#d4b896", "be cát": "#c4a882", "kem": "#fef9ee",
  "trắng xám": "#e5e7eb",
  "urban core": "#2f2f2e",
  "đen tech": "#111827",
  "trắng/đen": "#a0a0a0",
  "xám wash": "#8a9ba8",
  "đen/nâu": "#5c3a1e",
};

const guessHex = (name) => COLOR_MAP[name?.trim().toLowerCase()] ?? null;

const run = async () => {
  await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
  console.log("✅ Kết nối DB\n");

  const products = await Product.find({});
  let totalUpdated = 0;
  let totalSkipped = 0;
  const unmapped = new Set();

  for (const product of products) {
    let changed = false;
    for (const variant of product.variants) {
      const hex = guessHex(variant.color);
      if (hex && variant.colorHex !== hex) {
        variant.colorHex = hex;
        changed = true;
      } else if (!hex) {
        unmapped.add(variant.color);
      }
    }
    if (changed) {
      await product.save();
      console.log(`🎨 ${product.name}`);
      product.variants.forEach((v) => {
        const hex = guessHex(v.color);
        if (hex) console.log(`   ${v.color.padEnd(20)} → ${hex}`);
      });
      totalUpdated++;
    } else {
      totalSkipped++;
    }
  }

  console.log(`\n📊 Đã cập nhật: ${totalUpdated} sản phẩm, bỏ qua: ${totalSkipped}`);
  if (unmapped.size > 0) {
    console.log(`\n⚠️  Màu chưa có trong bảng map (cần thêm thủ công):`);
    [...unmapped].sort().forEach((c) => console.log(`   - "${c}"`));
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
