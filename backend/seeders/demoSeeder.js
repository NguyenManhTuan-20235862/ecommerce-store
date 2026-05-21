import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import Coupon from "../models/Coupon.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

dotenv.config();

// ─── helpers ────────────────────────────────────────────────────────────────

const makeVariants = (sizes, colors, stockRange = [8, 25]) => {
  const result = [];
  for (const size of sizes) {
    for (const color of colors) {
      result.push({
        size,
        color,
        stock:
          Math.floor(Math.random() * (stockRange[1] - stockRange[0] + 1)) +
          stockRange[0],
      });
    }
  }
  return result;
};

const daysFromNow = (d) => new Date(Date.now() + d * 24 * 60 * 60 * 1000);

const SIZES_TOP = ["S", "M", "L", "XL"];
const SIZES_BOTTOM = ["29", "30", "31", "32", "34"];
const SIZES_SHOE = ["39", "40", "41", "42", "43"];
const DEMO_PASSWORD = "Demo@1234";

// ─── users ───────────────────────────────────────────────────────────────────

const USERS_RAW = [
  {
    username: "nguyenvanminh92",
    email: "nguyenvanminh92@gmail.com",
    displayName: "Nguyễn Văn Minh",
    phone: "0912345678",
    addresses: [
      {
        province: "TP. Hồ Chí Minh",
        district: "Quận 1",
        ward: "Phường Bến Nghé",
        detail: "45 Nguyễn Huệ",
        isDefault: true,
      },
    ],
  },
  {
    username: "tranthihuong88",
    email: "tranthihuong88@gmail.com",
    displayName: "Trần Thị Hương",
    phone: "0978234567",
    addresses: [
      {
        province: "Hà Nội",
        district: "Quận Hoàn Kiếm",
        ward: "Phường Tràng Tiền",
        detail: "23 Hàng Bài",
        isDefault: true,
      },
    ],
  },
  {
    username: "lequoctuan95",
    email: "lequoctuan95@gmail.com",
    displayName: "Lê Quốc Tuấn",
    phone: "0936789012",
    addresses: [
      {
        province: "Đà Nẵng",
        district: "Quận Ngũ Hành Sơn",
        ward: "Phường Mỹ An",
        detail: "78 Nguyễn Văn Linh",
        isDefault: true,
      },
    ],
  },
  {
    username: "phamthuthaoo",
    email: "phamthuthaoo@gmail.com",
    displayName: "Phạm Thu Thảo",
    phone: "0901567890",
    addresses: [
      {
        province: "TP. Hồ Chí Minh",
        district: "Quận 9",
        ward: "Phường Hiệp Phú",
        detail: "56 Lê Văn Việt",
        isDefault: true,
      },
    ],
  },
  {
    username: "hoangducanh01",
    email: "hoangducanh01@gmail.com",
    displayName: "Hoàng Đức Anh",
    phone: "0356123456",
    addresses: [
      {
        province: "Hải Phòng",
        district: "Quận Ngô Quyền",
        ward: "Phường Máy Tơ",
        detail: "12 Điện Biên Phủ",
        isDefault: true,
      },
    ],
  },
  {
    username: "vungoclinh99",
    email: "vungoclinh99@gmail.com",
    displayName: "Vũ Ngọc Linh",
    phone: "0964890123",
    addresses: [
      {
        province: "Hà Nội",
        district: "Quận Ba Đình",
        ward: "Phường Thành Công",
        detail: "34 Láng Hạ",
        isDefault: true,
      },
    ],
  },
];

// ─── coupons ─────────────────────────────────────────────────────────────────

const COUPONS_DATA = [
  {
    code: "WELCOME10",
    discountType: "percent",
    discountValue: 10,
    minOrderValue: 0,
    maxUses: 100,
    expiresAt: daysFromNow(90),
    isActive: true,
    isPublic: true,
  },
  {
    code: "FREESHIP",
    discountType: "fixed",
    discountValue: 30000,
    minOrderValue: 200000,
    maxUses: null,
    expiresAt: daysFromNow(60),
    isActive: true,
    isPublic: true,
  },
  {
    code: "URBAN20",
    discountType: "percent",
    discountValue: 20,
    minOrderValue: 500000,
    maxUses: 50,
    expiresAt: daysFromNow(60),
    isActive: true,
    isPublic: true,
  },
  {
    code: "SUMMER15",
    discountType: "percent",
    discountValue: 15,
    minOrderValue: 400000,
    maxUses: 200,
    expiresAt: daysFromNow(60),
    isActive: true,
    isPublic: true,
  },
  {
    code: "VIPONLY100",
    discountType: "fixed",
    discountValue: 100000,
    minOrderValue: 800000,
    maxUses: 30,
    expiresAt: daysFromNow(180),
    isActive: true,
    isPublic: false,
  },
  {
    code: "FLASH30",
    discountType: "percent",
    discountValue: 30,
    minOrderValue: 1000000,
    maxUses: 20,
    expiresAt: daysFromNow(14),
    isActive: true,
    isPublic: true,
  },
  {
    code: "NEWDROP",
    discountType: "fixed",
    discountValue: 75000,
    minOrderValue: 0,
    maxUses: 150,
    expiresAt: daysFromNow(30),
    isActive: true,
    isPublic: true,
  },
  {
    code: "BACK2SCHOOL",
    discountType: "percent",
    discountValue: 12,
    minOrderValue: 350000,
    maxUses: 150,
    expiresAt: daysFromNow(90),
    isActive: true,
    isPublic: true,
  },
  {
    code: "BIGBUY25",
    discountType: "percent",
    discountValue: 25,
    minOrderValue: 1500000,
    maxUses: 40,
    expiresAt: daysFromNow(120),
    isActive: true,
    isPublic: false,
  },
  {
    code: "ENDSEASON",
    discountType: "fixed",
    discountValue: 200000,
    minOrderValue: 1200000,
    maxUses: 25,
    expiresAt: daysFromNow(30),
    isActive: true,
    isPublic: false,
  },
];

// ─── products ────────────────────────────────────────────────────────────────

const buildProducts = (catMap) => [
  // ── Áo ──────────────────────────────────────────────────────────────────
  {
    name: "Áo Khoác Denim Washed",
    slug: "ao-khoac-denim-washed",
    description:
      "Áo khoác jeans hiệu ứng wash vintage, cổ vest cứng cáp. Form regular fit ôm vai, đường may nổi bật phong cách retro-street. Phù hợp mặc ngoài áo thun hoặc hoodie mỏng.",
    price: 990000,
    compareAtPrice: 1250000,
    category: catMap["ao"],
    brand: "VIBE URBAN",
    sku: "VB-AK-001",
    images: [
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559570278-eb8d71d06403?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_TOP, ["Xanh Wash", "Đen Wash"]),
    material: "100% Cotton Denim 12oz",
    careInstructions:
      "Giặt riêng lần đầu, giặt máy ở 30°C lộn mặt trong, không sử dụng chất tẩy.",
    isFeatured: true,
  },
  {
    name: "Áo Linen Button-Up Minimal",
    slug: "ao-linen-button-up-minimal",
    description:
      "Áo sơ mi linen dài tay form rộng breezy fit, cổ dài button-down. Chất linen tự nhiên mát mẻ, thoáng khí lý tưởng cho mùa hè. Màu trung tính dễ mix với mọi loại quần.",
    price: 720000,
    compareAtPrice: 890000,
    category: catMap["ao"],
    brand: "VIBE URBAN",
    sku: "VB-AL-002",
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603252110389-5de14e4e6a5a?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_TOP, ["Trắng sữa", "Be cát", "Xanh rêu"]),
    material: "55% Linen, 45% Cotton",
    careInstructions:
      "Giặt tay hoặc máy nhẹ ở 30°C, là ủi khi còn hơi ẩm ở nhiệt độ trung bình.",
    isFeatured: false,
  },
  {
    name: "Áo Thun Henley Slub",
    slug: "ao-thun-henley-slub",
    description:
      "Áo thun cổ Henley 3 nút, chất cotton slub texture tự nhiên tạo vẻ ngoài đặc trưng không đồng đều. Form slim fit, ôm vừa phải — lựa chọn casual-cool cho ngày bình thường.",
    price: 420000,
    compareAtPrice: 0,
    category: catMap["ao"],
    brand: "VIBE URBAN",
    sku: "VB-AH-003",
    images: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_TOP, ["Trắng", "Đen than", "Xanh slate"]),
    material: "Cotton Slub Jersey 180gsm",
    careInstructions: "Giặt máy ở 30°C, phơi ngang tránh biến dạng.",
    isFeatured: false,
  },
  // ── Quần ────────────────────────────────────────────────────────────────
  {
    name: "Quần Jogger Tapered Premium",
    slug: "quan-jogger-tapered-premium",
    description:
      "Quần jogger form tapered ôm bắp chân, gấu thun bo tinh tế. Chất cotton French Terry dày dặn, ấm và mềm mại. Cạp thun rút dây, túi trước và túi chéo sau.",
    price: 680000,
    compareAtPrice: 850000,
    category: catMap["quan"],
    brand: "VIBE URBAN",
    sku: "VB-QJ-001",
    images: [
      "https://images.unsplash.com/photo-1611262588024-d12430b98920?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1562886812-a11d5f5c8ece?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_BOTTOM, ["Đen", "Xám nhạt", "Navy"]),
    material: "Cotton French Terry 300gsm",
    careInstructions: "Giặt máy ở 30°C, không sấy khô, phơi trong bóng râm.",
    isFeatured: true,
  },
  {
    name: "Quần Jeans Baggy Wide-Leg",
    slug: "quan-jeans-baggy-wide-leg",
    description:
      "Quần jeans baggy ống rộng phong cách Y2K-revival. Denim wash trung, cạp vừa, ống đứng tôn dáng. Kết hợp cùng sneaker chunky hay giày da đều chuẩn.",
    price: 820000,
    compareAtPrice: 1000000,
    category: catMap["quan"],
    brand: "VIBE URBAN",
    sku: "VB-QB-002",
    images: [
      "https://images.unsplash.com/photo-1565084888279-aca607bb0663?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_BOTTOM, ["Xanh trung", "Xanh nhạt"]),
    material: "Denim Cotton 100%, 12oz",
    careInstructions:
      "Giặt lộn mặt trong, giặt máy ở 30°C, không sử dụng chất làm mềm vải.",
    isFeatured: false,
  },
  // ── Hoodie & Sweater ─────────────────────────────────────────────────────
  {
    name: "Hoodie Embroidered Crest",
    slug: "hoodie-embroidered-crest",
    description:
      "Hoodie nỉ bông với huy hiệu thêu nổi trên ngực trái — chi tiết thủ công tinh tế. Form oversized thoải mái, mũ trùm dày, túi kangaroo rộng. Chất liệu cao cấp 380gsm không xù.",
    price: 890000,
    compareAtPrice: 1100000,
    category: catMap["hoodie-sweater"],
    brand: "VIBE URBAN",
    sku: "VB-HE-001",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_TOP, ["Đen", "Nâu mocha", "Xanh đậm"]),
    material: "Cotton French Terry 380gsm",
    careInstructions:
      "Giặt máy ở 30°C lộn mặt trong, không sấy khô, phơi trong bóng râm.",
    isFeatured: true,
  },
  {
    name: "Cardigan Knit Open-Front",
    slug: "cardigan-knit-open-front",
    description:
      "Áo cardigan len đan thủ công, kiểu mở không cài nút. Chất len pha mềm mại, giữ ấm vừa phải cho mùa thu đông. Phong cách clean minimal kết hợp cùng quần âu hoặc jeans đều đẹp.",
    price: 750000,
    compareAtPrice: 0,
    category: catMap["hoodie-sweater"],
    brand: "VIBE URBAN",
    sku: "VB-CK-002",
    images: [
      "https://images.unsplash.com/photo-1614495876629-b3d44e8e9d33?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_TOP, ["Be", "Xám khói", "Nâu đất"]),
    material: "70% Wool, 30% Acrylic",
    careInstructions:
      "Giặt tay trong nước lạnh với nước xả chuyên dụng, phơi nằm ngang.",
    isFeatured: false,
  },
  // ── Phụ kiện ─────────────────────────────────────────────────────────────
  {
    name: "Snapback 6-Panel Structured",
    slug: "snapback-6-panel-structured",
    description:
      "Mũ snapback 6 mảnh cứng với kẹp gài sau điều chỉnh size. Logo thêu nổi tối giản trên trán, lưỡi mũ phẳng chuẩn streetwear. Phù hợp nhiều hình dáng đầu.",
    price: 280000,
    compareAtPrice: 350000,
    category: catMap["phu-kien"],
    brand: "VIBE URBAN",
    sku: "VB-SB-001",
    images: [
      "https://images.unsplash.com/photo-1521369909029-2afed882baaa?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1588850561407-ed78c334e67a?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { size: "ONE SIZE", color: "Đen", stock: 30 },
      { size: "ONE SIZE", color: "Trắng", stock: 20 },
      { size: "ONE SIZE", color: "Navy", stock: 15 },
    ],
    material: "Cotton Canvas 100%, lưỡi mũ PE cứng",
    careInstructions: "Lau bằng khăn ẩm, không giặt máy.",
    isFeatured: false,
  },
  {
    name: "Thắt Lưng Da Reversible",
    slug: "that-lung-da-reversible",
    description:
      "Thắt lưng 2 mặt (đen / nâu) có thể đảo chiều qua khóa xoay 360°. Da PU cao cấp bề mặt mịn, khóa kim loại xi bạc chống gỉ. Phù hợp cả phong cách lịch sự lẫn casual.",
    price: 320000,
    compareAtPrice: 420000,
    category: catMap["phu-kien"],
    brand: "VIBE URBAN",
    sku: "VB-TL-002",
    images: [
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { size: "90cm", color: "Đen/Nâu", stock: 20 },
      { size: "95cm", color: "Đen/Nâu", stock: 20 },
      { size: "100cm", color: "Đen/Nâu", stock: 15 },
      { size: "105cm", color: "Đen/Nâu", stock: 10 },
    ],
    material: "PU Leather cao cấp, khóa hợp kim kẽm",
    careInstructions: "Lau khô sau khi sử dụng, tránh tiếp xúc độ ẩm cao.",
    isFeatured: false,
  },
  // ── Giày ─────────────────────────────────────────────────────────────────
  {
    name: "Chelsea Boot Da Lộn",
    slug: "chelsea-boot-da-lon",
    description:
      "Giày Chelsea boot cổ cao da lộn mềm, đàn hồi 2 bên dễ đi. Đế cao su Goodyear welt chắc chắn, gót 4cm tôn dáng. Phong cách smart casual — diện cùng quần âu hay jeans đều ổn.",
    price: 1850000,
    compareAtPrice: 2200000,
    category: catMap["giay"],
    brand: "VIBE URBAN",
    sku: "VB-CB-001",
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_SHOE, ["Đen", "Nâu cognac"]),
    material: "Da lộn bò tự nhiên, đế cao su tổng hợp",
    careInstructions:
      "Chải bụi sau mỗi lần đi, xịt chống thấm nước định kỳ, bảo quản với túi silica gel.",
    isFeatured: true,
  },
];

// ─── main ─────────────────────────────────────────────────────────────────────

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("✅ Kết nối DB thành công\n");

    // ── Users ────────────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
    let userOk = 0,
      userSkip = 0;
    for (const u of USERS_RAW) {
      const exists = await User.findOne({
        $or: [{ username: u.username }, { email: u.email }],
      });
      if (exists) {
        console.log(`⏭  User ${u.username} đã tồn tại, bỏ qua`);
        userSkip++;
        continue;
      }
      await User.create({ ...u, hashedPassword, role: "customer" });
      console.log(`👤 Tạo user: ${u.displayName} (${u.username})`);
      userOk++;
    }
    console.log(
      `\n📊 Users: ${userOk} tạo mới, ${userSkip} bỏ qua (password: ${DEMO_PASSWORD})\n`
    );

    // ── Coupons ──────────────────────────────────────────────────────────
    let couponOk = 0,
      couponSkip = 0;
    for (const c of COUPONS_DATA) {
      const exists = await Coupon.findOne({ code: c.code });
      if (exists) {
        console.log(`⏭  Coupon ${c.code} đã tồn tại, bỏ qua`);
        couponSkip++;
        continue;
      }
      await Coupon.create(c);
      const label =
        c.discountType === "percent"
          ? `${c.discountValue}%`
          : `${c.discountValue.toLocaleString()}đ`;
      console.log(`🎟  Tạo coupon: ${c.code} (${label})`);
      couponOk++;
    }
    console.log(`\n📊 Coupons: ${couponOk} tạo mới, ${couponSkip} bỏ qua\n`);

    // ── Products ─────────────────────────────────────────────────────────
    const categories = await Category.find({});
    if (categories.length === 0) {
      console.error(
        "❌ Chưa có danh mục — chạy productSeeder.js trước rồi mới chạy demoSeeder.js"
      );
      process.exit(1);
    }
    const catMap = Object.fromEntries(categories.map((c) => [c.slug, c._id]));

    let productOk = 0,
      productSkip = 0;
    for (const p of buildProducts(catMap)) {
      const exists = await Product.findOne({ slug: p.slug });
      if (exists) {
        console.log(`⏭  Sản phẩm "${p.name}" đã tồn tại, bỏ qua`);
        productSkip++;
        continue;
      }
      await Product.create(p);
      console.log(`📦 Tạo sản phẩm: ${p.name}`);
      productOk++;
    }
    console.log(
      `\n📊 Sản phẩm: ${productOk} tạo mới, ${productSkip} bỏ qua\n`
    );

    console.log("🎉 Demo seed hoàn tất!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

run();
