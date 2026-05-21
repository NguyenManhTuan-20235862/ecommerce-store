import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import Combo from "../models/Combo.js";

dotenv.config();

// ── Định nghĩa combo theo slug sản phẩm ─────────────────────────────────────

const COMBOS_RAW = [
  {
    name: "Bộ Đường Phố Casual",
    subtitle: "Henley Tee + Jogger + Snapback",
    items: [
      { slug: "ao-thun-henley-slub",       label: "Áo thun cổ Henley" },
      { slug: "quan-jogger-tapered-premium", label: "Quần Jogger Premium" },
      { slug: "snapback-6-panel-structured", label: "Mũ Snapback" },
    ],
    discountPct: 14,
    order: 0,
  },
  {
    name: "Set Denim On Denim",
    subtitle: "Khoác Denim Washed + Jeans Baggy",
    items: [
      { slug: "ao-khoac-denim-washed",    label: "Áo Khoác Denim" },
      { slug: "quan-jeans-baggy-wide-leg", label: "Quần Jeans Baggy" },
    ],
    discountPct: 13,
    order: 1,
  },
  {
    name: "Outfit Smart Casual",
    subtitle: "Linen Shirt + Slim Jeans + Thắt Lưng",
    items: [
      { slug: "ao-linen-button-up-minimal", label: "Áo Linen Sơ Mi" },
      { slug: "quan-jeans-slim-fit-dark",   label: "Quần Jeans Slim Dark" },
      { slug: "that-lung-da-reversible",    label: "Thắt Lưng Reversible" },
    ],
    discountPct: 13,
    order: 2,
  },
  {
    name: "Set Thu Đông Ấm Áp",
    subtitle: "Hoodie Embroidered + Quần Cargo",
    items: [
      { slug: "hoodie-embroidered-crest", label: "Hoodie Embroidered" },
      { slug: "quan-cargo-urban-core",    label: "Quần Cargo Urban" },
    ],
    discountPct: 12,
    order: 3,
  },
  {
    name: "Bộ Hoàn Chỉnh Premium",
    subtitle: "Linen + Slim Jeans + Chelsea Boot + Thắt Lưng",
    items: [
      { slug: "ao-linen-button-up-minimal", label: "Áo Linen Sơ Mi" },
      { slug: "quan-jeans-slim-fit-dark",   label: "Quần Jeans Slim Dark" },
      { slug: "chelsea-boot-da-lon",        label: "Chelsea Boot Da Lộn" },
      { slug: "that-lung-da-reversible",    label: "Thắt Lưng Reversible" },
    ],
    discountPct: 15,
    order: 4,
  },
];

// ── main ─────────────────────────────────────────────────────────────────────

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("✅ Kết nối DB thành công\n");

    // Load tất cả sản phẩm cần dùng
    const slugs = [...new Set(COMBOS_RAW.flatMap((c) => c.items.map((i) => i.slug)))];
    const products = await Product.find({ slug: { $in: slugs } }).select("slug name price");
    const productMap = Object.fromEntries(products.map((p) => [p.slug, p]));

    // Kiểm tra slug nào không tồn tại
    const missing = slugs.filter((s) => !productMap[s]);
    if (missing.length > 0) {
      console.warn("⚠️  Không tìm thấy sản phẩm:", missing.join(", "));
    }

    let created = 0;
    let skipped = 0;

    for (const raw of COMBOS_RAW) {
      // Idempotency check theo tên
      const exists = await Combo.findOne({ name: raw.name });
      if (exists) {
        console.log(`⏭  "${raw.name}" đã tồn tại, bỏ qua`);
        skipped++;
        continue;
      }

      // Build items, bỏ qua sản phẩm không tìm thấy
      const comboItems = raw.items
        .map((i) => ({ product: productMap[i.slug]?._id, label: i.label, _p: productMap[i.slug] }))
        .filter((i) => i.product);

      if (comboItems.length < 2) {
        console.warn(`⚠️  "${raw.name}" thiếu sản phẩm (chỉ còn ${comboItems.length}), bỏ qua`);
        continue;
      }

      // Giá gốc = tổng giá từng sản phẩm
      const originalPrice = comboItems.reduce((sum, i) => sum + (i._p?.price ?? 0), 0);
      const comboPrice    = Math.round(originalPrice * (1 - raw.discountPct / 100) / 1000) * 1000;
      const savings       = originalPrice - comboPrice;

      await Combo.create({
        name:      raw.name,
        subtitle:  raw.subtitle,
        products:  comboItems.map(({ product, label }) => ({ product, label })),
        comboPrice,
        isActive:  true,
        order:     raw.order,
      });

      console.log(
        `✅ "${raw.name}" | ${comboItems.length} sp | ` +
        `Gốc ${originalPrice.toLocaleString("vi-VN")}đ → ` +
        `Combo ${comboPrice.toLocaleString("vi-VN")}đ | ` +
        `Tiết kiệm ${savings.toLocaleString("vi-VN")}đ (-${raw.discountPct}%)`,
      );
      created++;
    }

    console.log(`\n📊 Combo: ${created} tạo mới, ${skipped} bỏ qua`);
    console.log("🎉 Combo seed hoàn tất!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

run();
