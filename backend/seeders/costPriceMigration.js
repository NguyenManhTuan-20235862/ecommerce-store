import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

dotenv.config();

// Biên lợi nhuận mục tiêu theo danh mục (giá vốn = price * tỉ lệ này)
const COST_RATIO = {
  "ao":             0.46,  // Áo — margin ~54%
  "quan":           0.44,  // Quần — margin ~56%
  "hoodie-sweater": 0.50,  // Hoodie/Sweater — margin ~50% (vải dày, gia công cao)
  "giay":           0.52,  // Giày — margin ~48% (nguyên liệu đế + da)
  "phu-kien":       0.38,  // Phụ kiện — margin ~62% (cost thấp)
};

const DEFAULT_RATIO = 0.46;

// Làm tròn về bội số gần nhất của 5.000đ
const roundTo5k = (n) => Math.round(n / 5000) * 5000;

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("✅ Kết nối DB thành công\n");

    const categories = await Category.find({}, "slug");
    const slugToId = Object.fromEntries(categories.map((c) => [c._id.toString(), c.slug]));

    const products = await Product.find({}).populate("category", "slug");
    console.log(`📦 Tìm thấy ${products.length} sản phẩm\n`);

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      // Bỏ qua sản phẩm đã có costPrice > 0
      if (product.costPrice > 0) {
        skipped++;
        continue;
      }

      const catSlug = product.category?.slug || "";
      const ratio = COST_RATIO[catSlug] ?? DEFAULT_RATIO;
      const costPrice = roundTo5k(product.price * ratio);

      await Product.updateOne({ _id: product._id }, { $set: { costPrice } });

      console.log(
        `  ✓ ${product.name.padEnd(45)} | Giá bán: ${String(product.price).padStart(8)}đ | Giá vốn: ${String(costPrice).padStart(8)}đ | Margin: ${(((product.price - costPrice) / product.price) * 100).toFixed(0)}%`
      );
      updated++;
    }

    console.log(`\n─────────────────────────────────────────────`);
    console.log(`✅ Đã cập nhật: ${updated} sản phẩm`);
    if (skipped > 0) console.log(`⏭  Bỏ qua (đã có giá vốn): ${skipped} sản phẩm`);
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Ngắt kết nối DB");
  }
};

run();
