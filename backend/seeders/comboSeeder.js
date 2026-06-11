import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import Combo from "../models/Combo.js";

dotenv.config();

// ── Định nghĩa combo theo slug sản phẩm ─────────────────────────────────────

const COMBOS_RAW = [
  {
    name: "Bộ Đường Phố Casual",
    subtitle: "Áo Pulse Drive + Cargo Urban + Nón Bucket",
    items: [
      { slug: "ao-thun-pulse-drive",    label: "Áo Thun Pulse Drive" },
      { slug: "quan-cargo-urban-core",  label: "Quần Cargo Urban Core" },
      { slug: "non-bucket-urban",       label: "Nón Bucket Urban" },
    ],
    discountPct: 14,
    order: 0,
  },
  {
    name: "Set Streetwear Oversized",
    subtitle: "Áo Oversize + Parachute Cargo + Balo",
    items: [
      { slug: "ao-thun-oversize-neon-tag", label: "Áo Thun Oversize" },
      { slug: "cargo-parachute-pants",     label: "Cargo Parachute" },
      { slug: "balo-den-techline",         label: "Balo Techline" },
    ],
    discountPct: 12,
    order: 1,
  },
  {
    name: "Outfit Smart Casual",
    subtitle: "Sơ Mi Oxford + Slim Jeans",
    items: [
      { slug: "ao-so-mi-oxford-minimal", label: "Áo Sơ Mi Oxford" },
      { slug: "quan-jeans-slim-fit-dark", label: "Quần Jeans Slim Dark" },
    ],
    discountPct: 10,
    order: 2,
  },
  {
    name: "Set Thu Đông Ấm Áp",
    subtitle: "Hoodie Neon + Cargo Nomad",
    items: [
      { slug: "hoodie-neon-signal",  label: "Hoodie Neon Signal" },
      { slug: "urban-nomad-cargo",   label: "Quần Cargo Nomad" },
    ],
    discountPct: 12,
    order: 3,
  },
  {
    name: "Bộ Hoàn Chỉnh Premium",
    subtitle: "Polo + Slim Jeans + Sneaker Monochrome",
    items: [
      { slug: "ao-polo-urban-classic",       label: "Áo Polo Urban Classic" },
      { slug: "quan-jeans-slim-fit-dark",    label: "Quần Jeans Slim Dark" },
      { slug: "sneaker-low-top-monochrome",  label: "Sneaker Low-top" },
    ],
    discountPct: 15,
    order: 4,
  },
];

// ── Hàm seed dùng được từ file khác (DB đã connect sẵn) ──────────────────────

export async function seedCombos() {
  await Combo.deleteMany({});

  const slugs = [...new Set(COMBOS_RAW.flatMap((c) => c.items.map((i) => i.slug)))];
  const products = await Product.find({ slug: { $in: slugs } }).select("slug name price");
  const productMap = Object.fromEntries(products.map((p) => [p.slug, p]));

  const missing = slugs.filter((s) => !productMap[s]);
  if (missing.length > 0) {
    console.warn("⚠️  Combo seed: không tìm thấy sản phẩm:", missing.join(", "));
  }

  let created = 0;
  for (const raw of COMBOS_RAW) {
    const comboItems = raw.items
      .map((i) => ({ product: productMap[i.slug]?._id, label: i.label, _p: productMap[i.slug] }))
      .filter((i) => i.product);

    if (comboItems.length < 2) {
      console.warn(`⚠️  Combo seed: "${raw.name}" thiếu sản phẩm, bỏ qua`);
      continue;
    }

    const originalPrice = comboItems.reduce((sum, i) => sum + (i._p?.price ?? 0), 0);
    const comboPrice    = Math.round(originalPrice * (1 - raw.discountPct / 100) / 1000) * 1000;

    await Combo.create({
      name:      raw.name,
      subtitle:  raw.subtitle,
      products:  comboItems.map(({ product, label }) => ({ product, label })),
      comboPrice,
      isActive:  true,
      order:     raw.order,
    });
    created++;
  }

  console.log(`🎁 Combo: ${created} / ${COMBOS_RAW.length} đã tạo`);
}

// ── CLI entry point ───────────────────────────────────────────────────────────

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("✅ Kết nối DB thành công\n");
    await seedCombos();
    console.log("🎉 Combo seed hoàn tất!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Chỉ chạy khi gọi trực tiếp (node comboSeeder.js), không chạy khi được import
const isMain = process.argv[1]?.replace(/\\/g, "/").endsWith("comboSeeder.js");
if (isMain) run();
