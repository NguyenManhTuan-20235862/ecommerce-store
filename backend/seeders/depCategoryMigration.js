import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";

dotenv.config();

async function main() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";
  await mongoose.connect(uri);
  console.log("Đã kết nối MongoDB.");

  const existing = await Category.findOne({ slug: "dep" });
  if (existing) {
    console.log("✓ Danh mục 'dep' đã tồn tại, bỏ qua.");
    process.exit(0);
  }

  const dep = await Category.create({
    name: "Dép",
    slug: "dep",
    description: "Dép, sandal, flip-flop và footwear mùa hè nam",
    image:
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?q=80&w=800&auto=format&fit=crop",
    isActive: true,
  });

  console.log(`✓ Đã tạo danh mục: ${dep.name} (slug: ${dep.slug})`);
  console.log("  → Vào Admin > Categories để thêm sản phẩm dép vào danh mục này.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Lỗi migration:", err);
  process.exit(1);
});
