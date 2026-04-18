import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

dotenv.config();

const CATEGORIES = [
  {
    name: "Áo",
    slug: "ao",
    description: "Áo thun, áo sơ mi, áo polo và các loại áo nam",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Quần",
    slug: "quan",
    description: "Quần jeans, quần cargo, quần kaki và các loại quần nam",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Hoodie & Sweater",
    slug: "hoodie-sweater",
    description: "Hoodie, sweater, áo khoác nỉ giữ ấm phong cách",
    image: "https://images.unsplash.com/photo-1619603364904-c0498317e145?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Phụ kiện",
    slug: "phu-kien",
    description: "Balo, túi, mũ, thắt lưng và phụ kiện thời trang nam",
    image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Giày",
    slug: "giay",
    description: "Giày sneaker, giày thể thao, giày da nam",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
  },
];

// Hàm tạo mảng variants tiêu chuẩn
const makeVariants = (sizes, colors, stockRange = [5, 20]) => {
  const variants = [];
  for (const size of sizes) {
    for (const color of colors) {
      variants.push({
        size,
        color,
        stock: Math.floor(Math.random() * (stockRange[1] - stockRange[0] + 1)) + stockRange[0],
      });
    }
  }
  return variants;
};

const SIZES_TOP = ["S", "M", "L", "XL"];
const SIZES_BOTTOM = ["29", "30", "31", "32", "34"];
const SIZES_SHOE = ["39", "40", "41", "42", "43"];

const buildProducts = (categoryMap) => [
  // ===== ÁO (6 sản phẩm) =====
  {
    name: "Áo Thun Pulse Drive",
    slug: "ao-thun-pulse-drive",
    description: "Áo thun cotton cao cấp với thiết kế tối giản, phù hợp mix đồ hằng ngày. Chất liệu mềm mịn, thoáng khí, form regular fit thoải mái.",
    price: 450000,
    compareAtPrice: 550000,
    category: categoryMap["ao"],
    brand: "VIBE URBAN",
    sku: "VU-AT-001",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_TOP, ["Đen", "Trắng", "Xám"]),
    material: "100% Cotton",
    careInstructions: "Giặt máy ở 30°C, không sử dụng chất tẩy, phơi trong bóng râm.",
    isFeatured: true,
  },
  {
    name: "Áo Polo Urban Classic",
    slug: "ao-polo-urban-classic",
    description: "Áo polo cổ bẻ sang trọng, chất pique dày dặn. Phù hợp đi làm, đi chơi hay sự kiện bán trang trọng.",
    price: 520000,
    compareAtPrice: 0,
    category: categoryMap["ao"],
    brand: "VIBE URBAN",
    sku: "VU-AP-002",
    images: [
      "https://images.unsplash.com/photo-1625910513413-5fc42b4c1b53?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_TOP, ["Đen", "Navy", "Trắng"]),
    material: "Cotton Pique 220gsm",
    careInstructions: "Giặt máy ở 30°C, là ủi ở nhiệt độ thấp.",
    isFeatured: false,
  },
  {
    name: "Áo Sơ Mi Oxford Minimal",
    slug: "ao-so-mi-oxford-minimal",
    description: "Áo sơ mi Oxford dài tay, cổ button-down. Phong cách smart casual, dễ dàng tạo ấn tượng chuyên nghiệp nhưng vẫn trẻ trung.",
    price: 680000,
    compareAtPrice: 850000,
    category: categoryMap["ao"],
    brand: "VIBE URBAN",
    sku: "VU-AS-003",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598032895455-1e67f0596889?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_TOP, ["Trắng", "Xanh nhạt"]),
    material: "Vải Oxford Cotton",
    careInstructions: "Giặt tay hoặc giặt máy nhẹ, là ủi ở nhiệt độ trung bình.",
    isFeatured: true,
  },
  {
    name: "Áo Thun Oversize Neon Tag",
    slug: "ao-thun-oversize-neon-tag",
    description: "Áo thun oversize với tag neon bắt mắt. Form rộng thoải mái, phong cách streetwear cá tính.",
    price: 390000,
    compareAtPrice: 0,
    category: categoryMap["ao"],
    brand: "VIBE URBAN",
    sku: "VU-AT-004",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_TOP, ["Đen", "Trắng"]),
    material: "Cotton French Terry 250gsm",
    careInstructions: "Giặt lộn mặt trong, giặt máy ở 30°C.",
    isFeatured: false,
  },

  // ===== QUẦN (3 sản phẩm) =====
  {
    name: "Quần Cargo Urban Core",
    slug: "quan-cargo-urban-core",
    description: "Quần cargo nhiều túi hộp phong cách techwear. Chất liệu ripstop bền bỉ, co giãn nhẹ, ống suông hiện đại.",
    price: 890000,
    compareAtPrice: 1100000,
    category: categoryMap["quan"],
    brand: "VIBE URBAN",
    sku: "VU-QC-001",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_BOTTOM, ["Đen", "Xám đậm", "Xanh rêu"]),
    material: "Ripstop Nylon pha Cotton",
    careInstructions: "Giặt máy ở 40°C, không sấy khô.",
    isFeatured: true,
  },
  {
    name: "Quần Jeans Slim Fit Dark",
    slug: "quan-jeans-slim-fit-dark",
    description: "Quần jeans slim fit wash tối. Chất denim dày dặn, co giãn vừa phải, tôn dáng cho phái mạnh.",
    price: 750000,
    compareAtPrice: 0,
    category: categoryMap["quan"],
    brand: "VIBE URBAN",
    sku: "VU-QJ-002",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_BOTTOM, ["Xanh đậm", "Đen"]),
    material: "Denim Cotton 98%, Spandex 2%",
    careInstructions: "Giặt lộn mặt trong, giặt riêng lần đầu, không sử dụng chất tẩy.",
    isFeatured: false,
  },
  {
    name: "Quần Short Khaki Relax",
    slug: "quan-short-khaki-relax",
    description: "Quần short khaki form relax fit. Chất vải kaki mềm, thoáng mát cho mùa hè năng động.",
    price: 450000,
    compareAtPrice: 550000,
    category: categoryMap["quan"],
    brand: "VIBE URBAN",
    sku: "VU-QS-003",
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_BOTTOM, ["Be", "Đen", "Navy"]),
    material: "Cotton Twill",
    careInstructions: "Giặt máy ở 30°C, là ủi ở nhiệt độ thấp.",
    isFeatured: false,
  },

  // ===== HOODIE & SWEATER (3 sản phẩm) =====
  {
    name: "Hoodie Neon Signal",
    slug: "hoodie-neon-signal",
    description: "Hoodie nỉ bông dày dặn với in neon phát sáng. Mũ trùm có dây rút, túi kangaroo phía trước. Lựa chọn hoàn hảo cho mùa đông.",
    price: 720000,
    compareAtPrice: 900000,
    category: categoryMap["hoodie-sweater"],
    brand: "VIBE URBAN",
    sku: "VU-HD-001",
    images: [
      "https://images.unsplash.com/photo-1619603364904-c0498317e145?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_TOP, ["Đen", "Xám", "Xanh navy"]),
    material: "French Terry 350gsm, lót nỉ bông",
    careInstructions: "Giặt máy ở 30°C, không sấy khô, phơi trong bóng râm.",
    isFeatured: true,
  },
  {
    name: "Sweater Crewneck Essential",
    slug: "sweater-crewneck-essential",
    description: "Áo sweater cổ tròn basic, chất nỉ mềm mịn. Thiết kế không logo, tối giản đúng chất minimalist.",
    price: 590000,
    compareAtPrice: 0,
    category: categoryMap["hoodie-sweater"],
    brand: "VIBE URBAN",
    sku: "VU-SW-002",
    images: [
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_TOP, ["Đen", "Kem", "Nâu"]),
    material: "Cotton Fleece 300gsm",
    careInstructions: "Giặt máy nhẹ ở 30°C, không vắt, phơi nằm ngang.",
    isFeatured: false,
  },
  {
    name: "Zip Hoodie Techwear Pro",
    slug: "zip-hoodie-techwear-pro",
    description: "Hoodie kéo khóa phong cách techwear. Vải chống nước nhẹ, túi ngực tiện dụng, chi tiết phản quang.",
    price: 950000,
    compareAtPrice: 1200000,
    category: categoryMap["hoodie-sweater"],
    brand: "VIBE URBAN",
    sku: "VU-ZH-003",
    images: [
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_TOP, ["Đen", "Xám đậm"]),
    material: "Polyester chống nước DWR, lót mesh",
    careInstructions: "Giặt tay, không sử dụng chất tẩy, phơi khô tự nhiên.",
    isFeatured: true,
  },

  // ===== PHỤ KIỆN (2 sản phẩm) =====
  {
    name: "Balo Đen Techline",
    slug: "balo-den-techline",
    description: "Balo techwear dung tích 25L. Ngăn laptop 15.6 inch, chống nước, khóa kéo YKK, dây đai chắc chắn.",
    price: 380000,
    compareAtPrice: 480000,
    category: categoryMap["phu-kien"],
    brand: "VIBE URBAN",
    sku: "VU-BL-001",
    images: [
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [{ size: "ONE SIZE", color: "Đen", stock: 30 }],
    material: "Cordura Nylon 500D",
    careInstructions: "Lau bằng khăn ẩm, không giặt máy.",
    isFeatured: true,
  },
  {
    name: "Nón Bucket Urban",
    slug: "non-bucket-urban",
    description: "Nón bucket hai mặt với vành rộng che nắng. Chất liệu cotton thoáng khí, phù hợp hoạt động ngoài trời.",
    price: 250000,
    compareAtPrice: 0,
    category: categoryMap["phu-kien"],
    brand: "VIBE URBAN",
    sku: "VU-NB-002",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c334e67a?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { size: "ONE SIZE", color: "Đen", stock: 25 },
      { size: "ONE SIZE", color: "Kem", stock: 15 },
    ],
    material: "Cotton Canvas",
    careInstructions: "Giặt tay nhẹ nhàng, phơi khô tự nhiên.",
    isFeatured: false,
  },

  // ===== GIÀY (2 sản phẩm) =====
  {
    name: "Sneaker Low-top Monochrome",
    slug: "sneaker-low-top-monochrome",
    description: "Giày sneaker cổ thấp phong cách tối giản. Đế cao su chống trượt, lót êm ái, phù hợp đi bộ cả ngày.",
    price: 1290000,
    compareAtPrice: 1500000,
    category: categoryMap["giay"],
    brand: "VIBE URBAN",
    sku: "VU-SN-001",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_SHOE, ["Trắng", "Đen"]),
    material: "Da tổng hợp PU, đế cao su",
    careInstructions: "Lau bằng khăn ẩm, xịt chống thấm nước định kỳ.",
    isFeatured: true,
  },
  {
    name: "Giày Thể Thao Runner X",
    slug: "giay-the-thao-runner-x",
    description: "Giày chạy bộ công nghệ đệm khí. Trọng lượng nhẹ, thoáng khí, phù hợp tập gym và chạy bộ hằng ngày.",
    price: 1490000,
    compareAtPrice: 0,
    category: categoryMap["giay"],
    brand: "VIBE URBAN",
    sku: "VU-RX-002",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    ],
    variants: makeVariants(SIZES_SHOE, ["Đen", "Trắng/Đen"]),
    material: "Mesh thoáng khí, đế EVA + cao su",
    careInstructions: "Lau bằng bàn chải mềm và nước ấm, phơi khô trong bóng râm.",
    isFeatured: false,
  },
];

// ====== MAIN SEEDER ======
const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("✅ Kết nối CSDL thành công!");

    // Xóa dữ liệu cũ
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("🗑️  Đã xóa dữ liệu cũ (Categories & Products)");

    // Tạo categories
    const createdCategories = await Category.insertMany(CATEGORIES);
    console.log(`📁 Đã tạo ${createdCategories.length} danh mục`);

    // Tạo map slug → ObjectId
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // Tạo products
    const productsData = buildProducts(categoryMap);
    const createdProducts = await Product.insertMany(productsData);
    console.log(`📦 Đã tạo ${createdProducts.length} sản phẩm`);

    // Tổng kết
    const featuredCount = createdProducts.filter((p) => p.isFeatured).length;
    console.log(`⭐ Trong đó ${featuredCount} sản phẩm nổi bật (isFeatured)`);
    console.log("\n🎉 Seed dữ liệu hoàn tất!");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed dữ liệu:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedProducts();
